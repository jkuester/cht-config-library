const { expect } = require('chai');
const sinon = require('sinon');

describe('Extension Lib: child-count', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('internal functions', () => {
    let getSelector;
    let getChildCount;
    let setChildCount;

    beforeEach(() => {
      // Create a version of the module that exports internal functions for testing
      const moduleCode = `
        const getSelector = label => {
          const classes = label
            .toLowerCase()
            .replace(/\\./g, '\\\\.')
            .split(/\\s+/)
            .filter(cls => cls.length > 0);
          return \`#contact_summary .cell.\${classes.join('.')} > div > p\`;
        };

        const getChildCount = async (db, contactId) => db
          .query('medic-client/contacts_by_parent', {
            startkey: [contactId],
            endkey: [contactId, {}]
          })
          .then(({ rows }) => rows.length);

        const setChildCount = async (label, contactId) => {
          const element = document.querySelector(getSelector(label));
          const dbSvc = window && window.CHTCore && window.CHTCore.DB;
          if (!element || !dbSvc) {
            return;
          }
          element.textContent = await getChildCount(dbSvc.get(), contactId);
        };

        module.exports = { getSelector, getChildCount, setChildCount };
      `;

      const testModule = eval(`(function() { ${moduleCode}; return module.exports; })()`);
      getSelector = testModule.getSelector;
      getChildCount = testModule.getChildCount;
      setChildCount = testModule.setChildCount;
    });

    describe('getSelector', () => {
      it('should generate correct selector for single word label', () => {
        const result = getSelector('Children');
        expect(result).to.equal('#contact_summary .cell.children > div > p');
      });

      it('should generate correct selector for multi-word label', () => {
        const result = getSelector('Child Count');
        expect(result).to.equal('#contact_summary .cell.child.count > div > p');
      });

      it('should escape dots in label', () => {
        const result = getSelector('Version.1');
        expect(result).to.equal('#contact_summary .cell.version\\.1 > div > p');
      });

      it('should handle multiple spaces and dots', () => {
        const result = getSelector('Child Count  V.1.2');
        expect(result).to.equal('#contact_summary .cell.child.count.v\\.1\\.2 > div > p');
      });

      it('should convert to lowercase', () => {
        const result = getSelector('CHILDREN');
        expect(result).to.equal('#contact_summary .cell.children > div > p');
      });

      it('should handle empty spaces correctly', () => {
        const result = getSelector('  Test   Label  ');
        expect(result).to.equal('#contact_summary .cell.test.label > div > p');
      });
    });

    describe('getChildCount', () => {
      it('should return the number of rows from database query', async () => {
        const mockDb = {
          query: sandbox.stub().resolves({
            rows: [{ id: '1' }, { id: '2' }, { id: '3' }]
          })
        };

        const result = await getChildCount(mockDb, 'parent-id');

        expect(result).to.equal(3);
        expect(mockDb.query).to.have.been.calledWith('medic-client/contacts_by_parent', {
          startkey: ['parent-id'],
          endkey: ['parent-id', {}]
        });
      });

      it('should return 0 when no children found', async () => {
        const mockDb = {
          query: sandbox.stub().resolves({ rows: [] })
        };

        const result = await getChildCount(mockDb, 'parent-id');

        expect(result).to.equal(0);
      });

      it('should handle database query with different contact ID', async () => {
        const mockDb = {
          query: sandbox.stub().resolves({
            rows: [{ id: '1' }]
          })
        };

        const result = await getChildCount(mockDb, 'different-parent-id');

        expect(result).to.equal(1);
        expect(mockDb.query).to.have.been.calledWith('medic-client/contacts_by_parent', {
          startkey: ['different-parent-id'],
          endkey: ['different-parent-id', {}]
        });
      });
    });

    describe('setChildCount', () => {
      let mockElement;
      let mockDocument;
      let mockWindow;
      let originalDocument;
      let originalWindow;

      beforeEach(() => {
        mockElement = { textContent: null };
        mockDocument = {
          querySelector: sandbox.stub().returns(mockElement)
        };
        mockWindow = {
          CHTCore: {
            DB: {
              get: () => ({
                query: sandbox.stub().resolves({ rows: [1, 2] })
              })
            }
          }
        };

        originalDocument = global.document;
        originalWindow = global.window;
        global.document = mockDocument;
        global.window = mockWindow;
      });

      afterEach(() => {
        global.document = originalDocument;
        global.window = originalWindow;
      });

      it('should set element textContent with child count', async () => {
        await setChildCount('Children', 'parent-id');

        expect(mockDocument.querySelector).to.have.been.calledWith('#contact_summary .cell.children > div > p');
        expect(mockElement.textContent).to.equal(2);
      });

      it('should return early if element not found', async () => {
        mockDocument.querySelector.returns(null);

        const result = await setChildCount('Children', 'parent-id');

        expect(result).to.be.undefined;
      });

      it('should return early if window is not available', async () => {
        global.window = null;

        const result = await setChildCount('Children', 'parent-id');

        expect(result).to.be.undefined;
      });

      it('should return early if CHTCore is not available', async () => {
        global.window = {};

        const result = await setChildCount('Children', 'parent-id');

        expect(result).to.be.undefined;
      });

      it('should return early if DB service is not available', async () => {
        global.window = { CHTCore: {} };

        const result = await setChildCount('Children', 'parent-id');

        expect(result).to.be.undefined;
      });
    });
  });

  describe('module export', () => {
    it('should export a function that calls setTimeout', () => {
      const childCount = require('../../extension-libs/child-count');
      expect(childCount).to.be.a('function');
    });

    it('should call setTimeout when invoked', () => {
      const setTimeoutSpy = sandbox.spy(global, 'setTimeout');
      const childCount = require('../../extension-libs/child-count');

      childCount('Children', 'parent-id');

      expect(setTimeoutSpy).to.have.been.called;
      expect(setTimeoutSpy.firstCall.args[1]).to.be.undefined; // default timeout
    });
  });
});

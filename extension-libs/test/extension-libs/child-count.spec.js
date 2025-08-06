const { expect } = require('chai');
const sinon = require('sinon');
const childCount = require('../../extension-libs/child-count');

describe('Extension Lib: child-count', () => {
  const originalDocument = global.document;
  const originalWindow = global.window;
  const contactId = 'contact123';

  let mockElement;
  let mockDb;
  let clock;

  beforeEach(() => {
    mockElement = { textContent: '' };
    mockDb = { query: sinon.stub() };

    global.document = { querySelector: sinon.stub() };
    global.window = {
      CHTCore: {
        DB: { get: sinon.stub().returns(mockDb) }
      }
    };

    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    global.document = originalDocument;
    global.window = originalWindow;
  });

  describe('when the environment is properly configured', () => {
    beforeEach(() => global.document.querySelector.returns(mockElement));

    afterEach(() => {
      expect(global.window.CHTCore.DB.get).to.have.been.calledOnceWithExactly();
      expect(mockDb.query).to.have.been.calledOnceWithExactly(
        'medic-client/contacts_by_parent',
        { startkey: [contactId], endkey: [contactId, {}] }
      );
    });

    it('sets the child count on the DOM element', async () => {
      const label = 'children Count   total';
      mockDb.query.resolves({ rows: [{ id: 'child1' }, { id: 'child2' }, { id: 'child3' }] });

      childCount(label, contactId);
      await clock.tickAsync(1);

      expect(global.document.querySelector).to.have.been.calledOnceWithExactly(
        '#contact_summary .cell.children.count.total > div > p'
      );
      expect(mockElement.textContent).to.equal(3);
    });

    it('properly escapes dots in label', async () => {
      const label = 'children.count.total';
      mockDb.query.resolves({ rows: [{ id: 'child1' }, { id: 'child2' }, { id: 'child3' }] });

      childCount(label, contactId);
      await clock.tickAsync(1);

      expect(global.document.querySelector).to.have.been.calledOnceWithExactly(
        '#contact_summary .cell.children\\.count\\.total > div > p'
      );
      expect(mockElement.textContent).to.equal(3);
    });

    it('sets count properly when no children are found', async () => {
      mockDb.query.resolves({ rows: [] });
      const label = 'no children';

      childCount(label, contactId);
      await clock.tickAsync(1);

      expect(global.document.querySelector).to.have.been.calledOnceWithExactly(
        '#contact_summary .cell.no.children > div > p'
      );
      expect(mockElement.textContent).to.equal(0);
    });
  });

  [
    null, {}, { CHTCore: {} }
  ].forEach(window => {
    it('handles missing CHTCore service gracefully', async () => {
      global.document.querySelector.returns(mockElement);
      global.window = window;
      const label = 'test label';

      childCount(label, contactId);
      clock.tick(1);

      expect(global.document.querySelector).to.have.been.calledOnceWithExactly(
        '#contact_summary .cell.test.label > div > p'
      );
      expect(mockDb.query).to.not.have.been.called;
      expect(mockElement.textContent).to.equal('');
    });
  });

  it('handles missing DOM element gracefully', async () => {
    global.document.querySelector.returns(null);
    const label = 'missing element';

    childCount(label, contactId);
    clock.tick(1);

    expect(global.document.querySelector).to.have.been.calledOnceWithExactly(
      '#contact_summary .cell.missing.element > div > p'
    );
    expect(mockDb.query).to.not.have.been.called;
    expect(mockElement.textContent).to.equal('');
  });
});

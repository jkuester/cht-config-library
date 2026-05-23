const { expect } = require('chai');
const sinon = require('sinon');

const CONTACT_ID = 'contact-123';
const DEFAULT_NOTE = 'Hello World';

describe('chw-notes extension', () => {
  let originalHtmlElement;
  let ChwNotes;
  let element;
  let getByUuid;
  let update;

  before(() => {
    originalHtmlElement = global.HTMLElement;
    global.HTMLElement = class {
      attachShadow() {
        const elements = {};
        this.shadowRoot = {
          innerHTML: '',
          getElementById(id) {
            if (!elements[id]) {
              elements[id] = {
                value: '',
                disabled: false,
                textContent: '',
                _handlers: {},
                addEventListener(event, handler) {
                  this._handlers[event] = handler;
                }
              };
            }
            return elements[id];
          }
        };
        return this.shadowRoot;
      }
    };
    ChwNotes = require('../../ui-extensions/chw-notes');
  });

  after(() => {
    global.HTMLElement = originalHtmlElement;
  });

  beforeEach(() => {
    getByUuid = sinon.stub();
    update = sinon.stub().resolves();
    element = new ChwNotes();
    element.cht = { v1: { person: { getByUuid, update } } };
    element.inputs = {
      userContactSummary: { contact_id: CONTACT_ID },
      config: { default_note: DEFAULT_NOTE }
    };
  });

  describe('connectedCallback', () => {
    it('loads the user contact by id and renders its existing notes', async () => {
      getByUuid.withArgs(CONTACT_ID).resolves({ _id: CONTACT_ID, notes: 'My existing note' });

      await element.connectedCallback();

      expect(getByUuid).to.have.been.calledOnceWithExactly(CONTACT_ID);
      expect(element.shadowRoot.innerHTML).to.include('My existing note');
      const textarea = element.shadowRoot.getElementById('notes');
      expect(textarea.disabled).to.equal(false);
    });

    it('falls back to the default_note from config when the contact has no notes', async () => {
      getByUuid.resolves({ _id: CONTACT_ID });

      await element.connectedCallback();

      expect(element.shadowRoot.innerHTML).to.include(DEFAULT_NOTE);
    });

    it('renders a disabled state with a clear message when no contact exists', async () => {
      getByUuid.resolves(null);

      await element.connectedCallback();

      expect(element.shadowRoot.innerHTML).to.include('No contact associated with the current user.');
      expect(element.shadowRoot.innerHTML).to.match(/<textarea[^>]+disabled/);
      expect(element.shadowRoot.innerHTML).to.match(/<button[^>]+disabled/);
    });

    it('surfaces load errors in the status message', async () => {
      getByUuid.rejects(new Error('network down'));

      await element.connectedCallback();

      expect(element.shadowRoot.innerHTML).to.include('Failed to load notes: network down');
      expect(element.shadowRoot.innerHTML).to.match(/<button[^>]+disabled/);
    });

    it('escapes HTML in the loaded note text to prevent injection', async () => {
      getByUuid.resolves({ _id: CONTACT_ID, notes: '<script>alert(1)</script>' });

      await element.connectedCallback();

      expect(element.shadowRoot.innerHTML).to.include('&lt;script&gt;alert(1)&lt;/script&gt;');
      expect(element.shadowRoot.innerHTML).to.not.include('<script>alert(1)</script>');
    });
  });

  describe('save flow', () => {
    beforeEach(async () => {
      getByUuid.resolves({ _id: CONTACT_ID, notes: 'original' });
      await element.connectedCallback();
    });

    it('persists the updated note text via person.update on click', async () => {
      const textarea = element.shadowRoot.getElementById('notes');
      const button = element.shadowRoot.getElementById('save');
      textarea.value = 'updated note';

      await button._handlers.click();

      expect(update).to.have.been.calledOnceWith(
        sinon.match({ _id: CONTACT_ID, notes: 'updated note' })
      );
      expect(element.shadowRoot.getElementById('status').textContent).to.equal('Saved.');
    });

    it('reports the error in the status text when update fails', async () => {
      update.rejects(new Error('write conflict'));
      const button = element.shadowRoot.getElementById('save');

      await button._handlers.click();

      expect(element.shadowRoot.getElementById('status').textContent).to.equal(
        'Failed to save: write conflict'
      );
    });

    it('re-enables the textarea and button after the save completes', async () => {
      const button = element.shadowRoot.getElementById('save');
      const textarea = element.shadowRoot.getElementById('notes');

      await button._handlers.click();

      expect(textarea.disabled).to.equal(false);
      expect(button.disabled).to.equal(false);
    });
  });
});

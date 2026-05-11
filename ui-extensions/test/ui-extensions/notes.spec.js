const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;

const createMockElement = () => {
  const listeners = {};
  return {
    value: '',
    disabled: false,
    textContent: '',
    addEventListener(event, handler) {
      listeners[event] = handler;
    },
    trigger(event) {
      return listeners[event] && listeners[event]();
    }
  };
};

const createMockShadowRoot = () => {
  const elements = {
    notes: createMockElement(),
    save: createMockElement(),
    status: createMockElement()
  };
  return {
    innerHTML: '',
    elements,
    getElementById(id) {
      return elements[id] || null;
    }
  };
};

describe('UI Extension: notes', () => {
  const originalWindow = global.window;
  const originalHTMLElement = global.HTMLElement;

  let NotesExtension;
  let userContactGet;
  let dbGet;
  let dbPut;
  let mockDb;

  before(() => {
    global.HTMLElement = class {
      constructor() {
        this.shadowRoot = null;
      }

      attachShadow() {
        this.shadowRoot = createMockShadowRoot();
        return this.shadowRoot;
      }
    };
    // Load module after HTMLElement is mocked.
    delete require.cache[require.resolve('../../ui-extensions/notes')];
    NotesExtension = require('../../ui-extensions/notes');
  });

  after(() => {
    global.HTMLElement = originalHTMLElement;
    delete require.cache[require.resolve('../../ui-extensions/notes')];
  });

  beforeEach(() => {
    userContactGet = sinon.stub();
    dbGet = sinon.stub();
    dbPut = sinon.stub();
    mockDb = { get: dbGet, put: dbPut };
    global.window = {
      CHTCore: {
        UserContact: { get: userContactGet },
        DB: { get: () => mockDb }
      }
    };
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  const buildComponent = () => new NotesExtension();

  it('attaches a shadow root in the constructor', () => {
    const el = buildComponent();
    expect(el.shadowRoot).to.exist;
  });

  it('loads the user contact and renders the existing note text', async () => {
    userContactGet.resolves({ _id: 'user-1', _rev: '1-abc', notes: 'hello world' });
    const el = buildComponent();

    await el.connectedCallback();

    expect(userContactGet).to.have.been.calledOnce;
    expect(el.shadowRoot.innerHTML).to.include('hello world');
    expect(el.shadowRoot.elements.notes.disabled).to.equal(false);
    expect(el.shadowRoot.elements.save.disabled).to.equal(false);
  });

  it('renders an empty note when the contact has no notes field', async () => {
    userContactGet.resolves({ _id: 'user-1', _rev: '1-abc' });
    const el = buildComponent();

    await el.connectedCallback();

    expect(el.shadowRoot.innerHTML).to.match(/<textarea[^>]*><\/textarea>/);
  });

  it('escapes HTML in the existing note text', async () => {
    userContactGet.resolves({ _id: 'user-1', _rev: '1-abc', notes: '<script>alert(1)</script>' });
    const el = buildComponent();

    await el.connectedCallback();

    expect(el.shadowRoot.innerHTML).to.include('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(el.shadowRoot.innerHTML).to.not.include('<script>alert(1)</script>');
  });

  it('shows a message and disables the form when the user has no contact', async () => {
    userContactGet.resolves(null);
    const el = buildComponent();

    await el.connectedCallback();

    expect(el.shadowRoot.innerHTML).to.include('No contact associated');
    expect(el.shadowRoot.innerHTML).to.match(/<textarea[^>]*\bdisabled\b/);
    expect(el.shadowRoot.innerHTML).to.match(/<button[^>]*\bdisabled\b/);
  });

  it('shows an error message when loading the user contact fails', async () => {
    userContactGet.rejects(new Error('boom'));
    const el = buildComponent();

    await el.connectedCallback();

    expect(el.shadowRoot.innerHTML).to.include('Failed to load notes: boom');
    expect(el.shadowRoot.innerHTML).to.match(/<button[^>]*\bdisabled\b/);
  });

  it('saves the updated note back to the contact doc', async () => {
    userContactGet.resolves({ _id: 'user-1', _rev: '1-abc', notes: 'old' });
    dbGet.resolves({ _id: 'user-1', _rev: '2-def', name: 'Alice', notes: 'old' });
    dbPut.resolves({ id: 'user-1', rev: '3-ghi' });

    const el = buildComponent();
    await el.connectedCallback();

    el.shadowRoot.elements.notes.value = 'new note text';
    await el.shadowRoot.elements.save.trigger('click');

    expect(dbGet).to.have.been.calledOnceWithExactly('user-1');
    expect(dbPut).to.have.been.calledOnceWithExactly({
      _id: 'user-1',
      _rev: '2-def',
      name: 'Alice',
      notes: 'new note text'
    });
    expect(el.shadowRoot.elements.status.textContent).to.equal('Saved.');
    expect(el.shadowRoot.elements.save.disabled).to.equal(false);
    expect(el.shadowRoot.elements.notes.disabled).to.equal(false);
  });

  it('uses the latest _rev from the database when saving', async () => {
    userContactGet.resolves({ _id: 'user-1', _rev: '1-stale', notes: '' });
    dbGet.resolves({ _id: 'user-1', _rev: '5-fresh', notes: '' });
    dbPut.resolves({ id: 'user-1', rev: '6-newer' });

    const el = buildComponent();
    await el.connectedCallback();
    el.shadowRoot.elements.notes.value = 'updated';
    await el.shadowRoot.elements.save.trigger('click');

    expect(dbPut.firstCall.args[0]._rev).to.equal('5-fresh');
  });

  it('shows an error message when saving fails', async () => {
    userContactGet.resolves({ _id: 'user-1', _rev: '1-abc', notes: '' });
    dbGet.resolves({ _id: 'user-1', _rev: '1-abc', notes: '' });
    dbPut.rejects(new Error('conflict'));

    const el = buildComponent();
    await el.connectedCallback();
    el.shadowRoot.elements.notes.value = 'something';
    await el.shadowRoot.elements.save.trigger('click');

    expect(el.shadowRoot.elements.status.textContent).to.equal('Failed to save: conflict');
    expect(el.shadowRoot.elements.save.disabled).to.equal(false);
    expect(el.shadowRoot.elements.notes.disabled).to.equal(false);
  });
});

const { expect } = require('chai');

describe('couch extension', () => {
  let originalHtmlElement;
  let Couch;
  let element;

  before(() => {
    originalHtmlElement = global.HTMLElement;
    global.HTMLElement = class {
      attachShadow() {
        this.shadowRoot = { innerHTML: '' };
        return this.shadowRoot;
      }
    };
    Couch = require('../../ui-extensions/couch');
  });

  after(() => {
    global.HTMLElement = originalHtmlElement;
  });

  beforeEach(async () => {
    element = new Couch();
    await element.connectedCallback();
  });

  it('renders a same-origin iframe pointing at /_utils/', () => {
    expect(element.shadowRoot.innerHTML).to.match(/<iframe[^>]+src="\/_utils\/"/);
  });
});

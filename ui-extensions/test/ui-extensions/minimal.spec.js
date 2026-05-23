const { expect } = require('chai');

describe('minimal extension', () => {
  let originalHtmlElement;
  let Minimal;
  let element;

  before(() => {
    originalHtmlElement = global.HTMLElement;
    global.HTMLElement = class {};
    Minimal = require('../../ui-extensions/minimal');
  });

  after(() => {
    global.HTMLElement = originalHtmlElement;
  });

  beforeEach(async () => {
    element = new Minimal();
    await element.connectedCallback();
  });

  it('renders "Hello world" directly into innerHTML', () => {
    expect(element.innerHTML).to.equal('Hello world');
  });
});

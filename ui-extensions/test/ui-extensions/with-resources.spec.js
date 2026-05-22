const { expect } = require('chai');
const sinon = require('sinon');

const IMAGE = { content_type: 'image/png', data: 'SU1H' };
const AUDIO = { content_type: 'audio/mpeg', data: 'QVVE' };
const VIDEO = { content_type: 'video/mp4', data: 'VklE' };

describe('with-resources extension', () => {
  let originalHtmlElement;
  let WithResources;
  let element;
  let translate;
  let getResource;
  let createObjectURL;

  before(() => {
    originalHtmlElement = global.HTMLElement;
    global.HTMLElement = class {
      attachShadow() {
        this.shadowRoot = { innerHTML: '' };
        return this.shadowRoot;
      }
    };

    WithResources = require('../../ui-extensions/with-resources');
  });

  after(() => {
    global.HTMLElement = originalHtmlElement;
  });

  beforeEach(async () => {
    let counter = 0;
    createObjectURL = sinon.stub(URL, 'createObjectURL').callsFake(() => `blob:fake-${++counter}`);

    translate = sinon.stub().returns('Extension with 3 resources');
    getResource = sinon.stub();
    getResource.withArgs('image-sample').returns(IMAGE);
    getResource.withArgs('audio-sample').returns(AUDIO);
    getResource.withArgs('video-sample').returns(VIDEO);

    element = new WithResources();
    element.cht = { v1: { translate, getResource } };

    await element.connectedCallback();
  });

  it('translates the heading', () => {
    expect(translate).to.have.been.calledOnceWithExactly(
      'ui-extension.with-resources.heading',
      { count: 3 }
    );
    expect(element.shadowRoot.innerHTML).to.include('<h2>Extension with 3 resources</h2>');
  });

  it('loads all three sample resources by key', () => {
    expect(getResource.args).to.deep.equal([
      ['image-sample'],
      ['audio-sample'],
      ['video-sample']
    ]);
  });

  it('renders the image inline as a data: URI', () => {
    expect(element.shadowRoot.innerHTML).to.include(
      `src="data:${IMAGE.content_type};base64,${IMAGE.data}"`
    );
  });

  it('renders audio and video via blob: URLs (not data: URIs)', () => {
    expect(createObjectURL).to.have.been.calledTwice;
    const blobs = createObjectURL.getCalls().map(call => call.args[0]);
    expect(blobs[0]).to.be.instanceOf(Blob);
    expect(blobs[0].type).to.equal(AUDIO.content_type);
    expect(blobs[1].type).to.equal(VIDEO.content_type);

    expect(element.shadowRoot.innerHTML).to.match(/<audio[^>]+src="blob:fake-\d+"/);
    expect(element.shadowRoot.innerHTML).to.match(/<video[^>]+src="blob:fake-\d+"/);
  });
});

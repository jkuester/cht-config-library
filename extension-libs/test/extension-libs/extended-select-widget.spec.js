const { expect } = require('chai');
const sinon = require('sinon');
const extendedSelectWidget = require('../../extension-libs/extended-select-widget');

describe('Extension Lib: extended-select-widget', () => {
  const originalDocument = global.document;
  const originalEvent = global.Event;
  const elementName = '/field/with/slashes';
  const extendedSelectId = '#\\/field\\/with\\/slashes-extended';

  let mockInput;
  let mockSelect;

  beforeEach(() => {
    mockInput = {
      style: {},
      value: '',
      insertAdjacentHTML: sinon.stub(),
      dispatchEvent: sinon.stub()
    };
    mockSelect = { addEventListener: sinon.stub() };
    global.document = { querySelector: sinon.stub() };
  });

  afterEach(() => {
    global.document = originalDocument;
    global.Event = originalEvent;
  });

  describe('when the widget is first created', () => {
    beforeEach(() => {
      // Setup for first-time creation (select doesn't exist yet)
      global.document.querySelector
        .withArgs(`input[type="text"][name="${elementName}"]`).returns(mockInput)
        .withArgs(extendedSelectId).onFirstCall().returns(null)
        .withArgs(extendedSelectId).onSecondCall().returns(mockSelect);
    });

    it('initializes the select widget with an empty value', () => {
      const result = extendedSelectWidget({ v: elementName });

      expect(result).to.deep.equal({ t: 'str', v: '' });
      expect(mockInput.style.display).to.equal('none');
      expect(global.document.querySelector.args).to.deep.equal([
        [`input[type="text"][name="${elementName}"]`],
        [extendedSelectId],
        [extendedSelectId]
      ]);
      expect(mockInput.insertAdjacentHTML).to.have.been.calledOnce;
      expect(mockInput.insertAdjacentHTML.firstCall.args[0]).to.equal('afterend');
      expect(mockInput.insertAdjacentHTML.firstCall.args[1]).to.include(`id="${elementName}`);
      expect(mockSelect.addEventListener).to.have.been.calledOnce;
      expect(mockSelect.addEventListener.firstCall.args[0]).to.equal('change');
      expect(mockInput.value).to.be.empty;
      expect(mockInput.dispatchEvent).to.not.have.been.called;
    });

    it('updates the value stored in the input when a new value is selected', () => {
      const mockEvent = { target: { value: 'hello world' } };

      extendedSelectWidget({ v: elementName });

      expect(mockSelect.addEventListener).to.have.been.calledOnce;
      expect(mockSelect.addEventListener.firstCall.args[0]).to.equal('change');
      const eventFn = mockSelect.addEventListener.firstCall.args[1];
      expect(mockInput.value).to.be.empty;
      expect(mockInput.dispatchEvent).to.not.have.been.called;

      // Simulate change event when user selects an option
      eventFn(mockEvent);

      expect(mockInput.value).to.equal(mockEvent.target.value);
      expect(mockInput.dispatchEvent).to.have.been.calledOnceWithExactly(new Event('change', { bubbles: true }));
    });
  });

  it('subsequent calls should return the current input value and not re-init', () => {
    global.document.querySelector
      .withArgs(`input[type="text"][name="${elementName}"]`).returns(mockInput)
      .withArgs(extendedSelectId).returns(mockSelect);
    mockInput.value = 'cat';

    const result = extendedSelectWidget({ v: elementName });

    expect(result).to.deep.equal({ t: 'str', v: 'cat' });
    expect(mockInput.style.display).to.be.undefined;
    expect(global.document.querySelector.args).to.deep.equal([
      [`input[type="text"][name="${elementName}"]`],
      [extendedSelectId],
    ]);
    expect(mockInput.insertAdjacentHTML).to.have.not.been.called;
    expect(mockSelect.addEventListener).to.have.not.been.called;
    expect(mockInput.dispatchEvent).to.not.have.been.called;
  });
});

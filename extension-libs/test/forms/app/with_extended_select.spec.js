const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'with_extended_select';

describe('With Extended Select form', () => {
  it('can successfully submit the form', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form }, ['dog', 'cat']);

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;

    // Note that this is not really testing the extended select widget itself.
    // It does at least confirm the form submits without errors.
    expect(fields).excludingEvery('meta').to.deep.equal({ page: {
      select_0: 'dog',
      select_1: 'cat',
    } });
  });
});

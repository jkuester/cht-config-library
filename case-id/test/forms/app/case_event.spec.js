const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'case_event';

describe('Case Event form', () => {
  it('submits successfully', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form });

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({ case_id: '' });
  });
});

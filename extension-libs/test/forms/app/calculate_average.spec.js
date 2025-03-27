const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'calculate_average';

describe('Calculate Average form', () => {
  it('can successfully submit the form', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form }, [1, 3]);

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    
    expect(fields).excludingEvery('meta').to.deep.equal({ page: {
      first: '1',
      second: '3',
      average: '',
      message: ''
    } });
  });
});

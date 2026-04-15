const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'repeated_file_input';

describe('Repeated File Input form', () => {
  it('submits form successfully', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      form,
      [], // test harness does not currently support filling out file questions.
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      page: {
        intro: '',
        image: ''
      }
    });
  });
});

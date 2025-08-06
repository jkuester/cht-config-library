const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'dynamic_error_message';

describe('Dynamic Error Message form', () => {
  it('submits form with number inside valid range', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form }, [3]);

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      page: {
        my_num: '3',
        my_num_issue: '',
        my_num_issue_msg: '',
      },
    });
  });

  [
    [1, 'The number is too low'],
    [5, 'The number is too high'],
  ].forEach(([num, msg]) => {
    it(`fails to submit form when ${msg}`, async () => {
      const {
        errors,
        report,
        additionalDocs
      } = await harness.fillForm({ form }, [num]);

      expect(errors).to.deep.equal([
        { // Bug in test harness?  We are getting this duplicate entry for a validation error on a question with a hint.
          type: 'validation',
          question: `Enter a number from 2 to 4\nSee this forum thread for more context.\n${msg}`,
          msg: 'See this forum thread for more context.',
        },
        {
          type: 'validation',
          question: `Enter a number from 2 to 4\nSee this forum thread for more context.\n${msg}`,
          msg,
        }
      ]);
      expect(additionalDocs).to.be.empty;
      expect(report).to.be.undefined;
    });
  });
});

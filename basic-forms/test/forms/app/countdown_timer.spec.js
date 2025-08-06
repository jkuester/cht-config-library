const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'countdown_timer';

describe('Countdown Timer form', () => {
  it('submits form successfully', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      form,
      ['OK'], // "Simulates" waiting for required timer
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      page: {
        intro: '',
        required_timer: 'OK',
        deprecated_timer: '15',
      }
    });
  });

  it('cannot submit without waiting for required timer', async () => {
    const {
      errors,
      report,
      additionalDocs
    } = await harness.fillForm(form, []);

    expect(errors).to.deep.equal([{
      type: 'validation',
      question: 'Required Timer*\n' +
        'You must wait for this timer to complete before submitting the form\n' +
        'enketo.constraint.required',
      'msg': 'enketo.constraint.required'
    }]);
    expect(additionalDocs).to.be.empty;
    expect(report).to.be.undefined;
  });
});

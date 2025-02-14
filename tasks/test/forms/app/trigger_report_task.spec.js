const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'trigger_report_task';

const CONTACT = {
  _id: 'patient_id',
};

describe('Trigger Report Task form', () => {
  it('can successfully submit the form with a contact in context', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      { 
        form,
        subject: CONTACT,
      },
      []
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    
    expect(fields).excludingEvery('meta').to.deep.equal({
      inputs: {
        source: 'action',
        contact: CONTACT,
      },
      patient_uuid: CONTACT._id,
      submit: ''
    });
  });

  it('can successfully submit the form with a selected contact', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      {
        form,
        subject: CONTACT,
        content: {
          source: 'user',
          inputs: { contact: CONTACT } // Simulate selecting a contact
        }
      },
      [],
      []
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;

    expect(fields).excludingEvery('meta').to.deep.equal({
      inputs: {
        source: 'user',
        contact: CONTACT,
      },
      patient_uuid: CONTACT._id,
      submit: ''
    });
  });
});

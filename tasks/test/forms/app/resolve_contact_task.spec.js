const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'resolve_contact_task';

const CONTACT = {
  _id: 'patient_id',
  name: 'Current Patient',
};

describe('Resolve Contact Task form', () => {
  it('can successfully submit the form', async () => {
    const taskInputData = {
      source: 'task',
      source_id: CONTACT._id,
      task_id: 'task_id',
      from_modify_content: {
        event_id: 'event_id'
      }
    };

    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      { 
        form,
        subject: CONTACT,
        content: {
          inputs: taskInputData,
          source: taskInputData.source // Avoid harness overwriting source
        }
      },
      []
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    
    expect(fields).excludingEvery('meta').to.deep.equal({
      inputs: {
        ...taskInputData,
        contact: CONTACT,
      },
      patient_uuid: CONTACT._id,
      submit: ''
    });
  });
});

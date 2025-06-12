const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'mark_household_complete';

const CONTACT = {
  _id: 'household_id',
  name: 'Current Household',
};

describe('Mark Household Complete form', () => {
  it('can successfully submit the form', async () => {
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
      inputs: { contact: CONTACT },
      patient_uuid: CONTACT._id,
      submit: ''
    });
  });
});

const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'select_contact';

const CONTACT = {
  _id: 'patient_id',
  name: 'Current Patient',
};

describe('Select Contact form', () => {
  it('loads contact data both via calculation and user selection', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      { 
        form,
        userSettingsDoc: { contact_id: CONTACT._id },
        content: { contact_page: { contact: CONTACT } } // Can simulate user selection by providing contact data
      },
      [],
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      intro: '',
      inputs: {
        user: {
          contact_id: 'patient_id'
        }
      },
      user_page: {
        user_contact: {
          _id: 'patient_id',
          name: '', // The rest of the data is not loaded because the db-object widget is not supported by the harness
          role: '',
        },
        user_name: '',
        user_role: '',
        description: '',
      },
      contact_page: {
        contact: CONTACT,
        selected_contact_name: CONTACT.name,
        description: '',
      },
    });
  });
});

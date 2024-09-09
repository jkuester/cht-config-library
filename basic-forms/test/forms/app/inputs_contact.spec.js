const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'inputs_contact';

const CONTACT = {
  _id: 'patient_id',
  name: 'Current Patient',
};

describe('Inputs Contact form', () => {
  it('uses provided contact when opening form from a contact profile page', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      { 
        form, 
        subject: CONTACT,
        content: {} // For some reason the harness is defaulting source to 'action' when no content is provided
      },
      [],
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      intro: '',
      inputs: {
        source: 'contact',
        contact: CONTACT,
      },
      patient_uuid: CONTACT._id,
      contact_name: CONTACT.name,
      hello: '',
    });
  });

  it('loads selected contact when opening form from reports page', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      {
        form,
        subject: null,
        content: {}
      },
      [],
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    // The harness currently does not support using the db-object widget to load a contact doc. So, cannot assert much.
    expect(fields).excludingEvery('meta').to.deep.equal({
      intro: '',
      inputs: {
        source: 'user',
        contact: {
          _id: '',
          name: '',
        },
      },
      patient_uuid: '',
      contact_name: '',
      hello: '',
    });
  });
});

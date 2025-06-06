const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'mute_contact';

const contact = {
  _id: 'contact-uuid'
};

describe('Mute Contact form', () => {
  it('submits successfully', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form, content: { contact } });

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      inputs: {
        contact: {
          _id: 'contact-uuid',
        },
        source: 'contact',
      },
      patient_uuid: contact._id,
      submit: ''
    });
  });
});

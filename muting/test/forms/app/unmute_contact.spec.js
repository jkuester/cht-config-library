const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'unmute_contact';

const contact = {
  _id: 'contact-uuid'
};

describe('Unmute Contact form', () => {
  it('submits successfully', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form, content: { contact } });

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).to.deep.include({
      patient_uuid: contact._id,
    });
  });
});

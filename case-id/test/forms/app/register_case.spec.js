const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'register_case';

const CONTACT = {
  _id: 'patient_id',
  name: 'Current Patient',
};

describe('Register Case form', () => {
  it('submits successfully', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({
      form,
      subject: CONTACT,
      content: {}
    });

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excluding(['meta']).to.deep.equal({
      inputs: {
        contact: CONTACT,
        meta: { location: { error: '', lat: '', long: '', message: '', }, },
        source: 'contact',
        source_id: '',
      },
      patient_uuid: CONTACT._id,
      submit: ''
    });
  });
});

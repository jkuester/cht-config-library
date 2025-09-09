const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const CONTACT_TYPE = 'clinic';
const HOUSEHOLD = {
  contact: {},
  info: '',
  name: 'Name of Household',
  type: CONTACT_TYPE,
  meta: {
    created_by: '',
    created_by_person_uuid: 'default_user',
    created_by_place_uuid: ''
  }
};
const HEAD_OF_HOUSEHOLD = {
  name: 'Head of Household',
  type: 'person',
  parent: {},
  info: '',
  meta: {
    created_by: '',
    created_by_person_uuid: 'default_user',
    created_by_place_uuid: ''
  }
};

describe('Clinic Create form', () => {
  it('submits form successfully', async () => {
    const {
      errors,
      contacts: [contact, ...additionalContacts],
    } = await harness.fillContactCreateForm(
      CONTACT_TYPE,
      [],
      [HEAD_OF_HOUSEHOLD.name],
      [HOUSEHOLD.name],
      [] // It seems that the test-harness repeat logic does not support the repeat-in-contact-form edge case
    );

    expect(errors).to.be.empty;
    expect(contact).excludingEvery(['_id', 'reported_date']).to.deep.equal(HOUSEHOLD);
    expect(additionalContacts).to.have.length(1);
    expect(additionalContacts[0]).excludingEvery(['_id', 'reported_date']).to.deep.equal(HEAD_OF_HOUSEHOLD);
  });
});

const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const CONTACT_TYPE = 'person';
const PERSON = {
  name: 'Head of Household',
  type: 'person',
  meta: {
    created_by: '',
    created_by_person_uuid: 'default_user',
    created_by_place_uuid: ''
  }
};

describe('Person Create form', () => {
  it('submits form successfully', async () => {
    const {
      errors,
      contacts: [contact, ...additionalContacts],
    } = await harness.fillContactCreateForm(
      CONTACT_TYPE,
      [],
      [PERSON.name],
    );

    expect(errors).to.be.empty;
    expect(contact).excludingEvery(['_id', 'reported_date']).to.deep.equal(PERSON);
    expect(additionalContacts).to.be.empty;
  });
});

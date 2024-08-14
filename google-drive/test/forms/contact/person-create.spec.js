const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const contactType = 'person';

describe('Person Create form', () => {
  const dateOfBirth = new Date().toISOString().split('T')[0];

  it('submits form successfully', async () => {
    const person = {
      type: 'person',
      name: 'John Doe',
      short_name: 'John',
      date_of_birth: dateOfBirth,
      date_of_birth_method: '',
      ephemeral_dob: {
        dob_calendar: dateOfBirth,
        dob_method: '',
        dob_iso: dateOfBirth,
        dob_approx: `NaN-NaN-${dateOfBirth.split('-')[2]}`,
        dob_raw: dateOfBirth,
        ephemeral_months: 'NaN',
        ephemeral_years: 'NaN',
      },
      sex: 'female',
      phone: '+254712345678',
      phone_alternate: '+254712345679',
      role: 'patient',
      external_id: '12345',
      notes: 'Some notes',
    };

    const {
      errors,
      contacts: [contact, ...additionalContacts],
    } = await harness.fillContactCreateForm(
      contactType,
      [
        person.name,
        person.short_name,
        person.ephemeral_dob.dob_calendar,
        person.ephemeral_dob.dob_method,
        person.sex,
        person.phone,
        person.phone_alternate,
        person.role,
        person.external_id,
        person.notes,
      ]
    );

    expect(errors).to.be.empty;
    expect(additionalContacts).to.be.empty;
    expect(contact).excluding(['meta', '_id', 'reported_date']).to.deep.equal(person);
  });
});

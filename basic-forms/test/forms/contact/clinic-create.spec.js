const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const CONTACT_TYPE = 'clinic';
const NOW = '2026-09-22';

const META = {
  created_by: '',
  created_by_person_uuid: 'default_user',
  created_by_place_uuid: ''
};

const NEW_PERSON = {
  type: 'person',
  short_name: '',
  date_of_birth_method: '',
  phone: '',
  phone_alternate: '',
  role_other: '',
  external_id: '',
  notes: '',
  user_for_contact: { create: 'false' },
  meta: META,
};

const HOUSEHOLD = {
  type: CONTACT_TYPE,
  external_id: '',
  notes: '',
  geolocation: '',
  meta: META,
};

const REQUIRED_ERROR = (question) => ({
  type: 'validation',
  question: `${question}\nenketo.constraint.required`,
  msg: 'enketo.constraint.required',
});

const expectSavedDoc = (doc) => {
  expect(doc._id).to.be.a('string').that.is.not.empty;
  expect(doc.reported_date).to.be.a('number');
};

const fillForm = (primaryContactAnswers, householdAnswers) => harness.fillContactCreateForm(
  CONTACT_TYPE,
  primaryContactAnswers,
  householdAnswers,
);

describe('Clinic Create form', () => {
  it('creates the household and a new primary contact, naming the household after them', async () => {
    const { errors, contacts } = await fillForm(
      [
        'new_person', 'Head of Household', 'HoH', null, '2000-01-15', '+254712345678', null, 'female', 'nurse',
        'P-001', 'Person notes'
      ],
      ['true', 'H-001', 'Household notes'],
    );

    expect(errors).to.be.empty;
    expect(contacts).to.have.length(2);
    const [household, primaryContact] = contacts;
    expectSavedDoc(household);
    expectSavedDoc(primaryContact);

    expect(household).excluding(['_id', 'reported_date']).to.deep.equal({
      ...HOUSEHOLD,
      name: 'Head of Household\'s Household',
      external_id: 'H-001',
      notes: 'Household notes',
      contact: { _id: primaryContact._id },
    });
    expect(primaryContact).excluding(['_id', 'reported_date']).to.deep.equal({
      ...NEW_PERSON,
      name: 'Head of Household',
      short_name: 'HoH',
      date_of_birth: '2000-01-15',
      phone: '+254712345678',
      sex: 'female',
      role: 'nurse',
      external_id: 'P-001',
      notes: 'Person notes',
      parent: { _id: household._id },
    });
  });

  it('creates a CHW primary contact with an approximate age and a manually named household', async () => {
    await harness.setNow(NOW);
    const { errors, contacts } = await fillForm(
      ['new_person', 'Jane Doe', null, 'approx', '30', '6', '+254712345679', null, 'female', 'chw'],
      ['false', 'Doe Household'],
    );

    expect(errors).to.be.empty;
    expect(contacts).to.have.length(2);
    const [household, primaryContact] = contacts;
    expectSavedDoc(household);
    expectSavedDoc(primaryContact);

    expect(household).excluding(['_id', 'reported_date']).to.deep.equal({
      ...HOUSEHOLD,
      name: 'Doe Household',
      contact: { _id: primaryContact._id },
    });
    expect(primaryContact).excluding(['_id', 'reported_date']).to.deep.equal({
      ...NEW_PERSON,
      name: 'Jane Doe',
      date_of_birth: '1996-03-22', // NOW minus 30 years and 6 months
      date_of_birth_method: 'approx',
      phone: '+254712345679',
      sex: 'female',
      role: 'chw',
      user_for_contact: { create: 'true' }, // CHW with a phone number gets a user created
      parent: { _id: household._id },
    });
  });

  it('creates a household without a primary contact', async () => {
    const { errors, contacts } = await fillForm(
      ['none'],
      ['My Household'], // Only the manual name is asked for when there is no primary contact
    );

    expect(errors).to.be.empty;
    expect(contacts).to.have.length(1);
    const [household] = contacts;
    expectSavedDoc(household);
    expect(household).excluding(['_id', 'reported_date']).to.deep.equal({
      ...HOUSEHOLD,
      name: 'My Household',
      contact: '',
    });
  });

  it('requires choosing how to set the primary contact', async () => {
    const { errors, contacts } = await harness.fillContactCreateForm(CONTACT_TYPE, []);

    expect(errors).to.deep.equal([
      REQUIRED_ERROR('Set the Primary Contact*\nCreate a new person\nSelect an existing person\nSkip this step'),
    ]);
    expect(contacts).to.be.empty;
  });

  it('requires the name, date of birth, and sex of a new primary contact', async () => {
    const { errors, contacts } = await harness.fillContactCreateForm(CONTACT_TYPE, ['new_person']);

    expect(errors).to.deep.equal([
      REQUIRED_ERROR('Full Name*'),
      REQUIRED_ERROR('Date of birth*'),
      REQUIRED_ERROR('Sex*\nFemale\nMale'),
    ]);
    expect(contacts).to.be.empty;
  });
});

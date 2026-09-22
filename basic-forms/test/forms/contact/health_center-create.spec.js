const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const CONTACT_TYPE = 'health_center';
const HEALTH_CENTER_NAME = 'Name of Health Center';
const PRIMARY_CONTACT_NAME = 'Name of Primary Contact';
const DISTRICT_HOSPITAL_NAME = 'Name of District Hospital';
const STAFF_NAMES = ['Name of Staff Member One', 'Name of Staff Member Two'];

const REQUIRED_NAME_ERROR = {
  type: 'validation',
  question: 'Name*\nenketo.constraint.required',
  msg: 'enketo.constraint.required',
};

const fillForm = (staffAnswers = []) => harness.fillContactCreateForm(
  CONTACT_TYPE,
  [HEALTH_CENTER_NAME],
  [PRIMARY_CONTACT_NAME],
  staffAnswers, // Integer answer clicks the "+" button that many times, then one name per staff member
  [DISTRICT_HOSPITAL_NAME],
);

const expectSavedDoc = (doc) => {
  expect(doc._id).to.be.a('string').that.is.not.empty;
  expect(doc.reported_date).to.be.a('number');
};

const expectPersonUnderHealthCenter = (person, name, healthCenter, districtHospital) => {
  expectSavedDoc(person);
  expect(person).excluding(['_id', 'reported_date']).to.deep.equal({
    type: 'person',
    name,
    parent: {
      _id: healthCenter._id,
      parent: { _id: districtHospital._id },
    },
  });
};

const expectCreatedContacts = (contacts, staffNames = []) => {
  expect(contacts).to.have.length(3 + staffNames.length);
  const [healthCenter, ...additionalContacts] = contacts;
  const districtHospital = additionalContacts.find(({ type }) => type === 'district_hospital');
  const primaryContact = additionalContacts.find(({ name }) => name === PRIMARY_CONTACT_NAME);
  const staff = staffNames.map(staffName => additionalContacts.find(({ name }) => name === staffName));

  expectSavedDoc(districtHospital);
  expect(districtHospital).excluding(['_id', 'reported_date']).to.deep.equal({
    type: 'district_hospital',
    name: DISTRICT_HOSPITAL_NAME,
  });

  // The health center is created under the new district hospital and with the new primary contact
  expectSavedDoc(healthCenter);
  expect(healthCenter).excluding(['_id', 'reported_date']).to.deep.equal({
    type: CONTACT_TYPE,
    name: HEALTH_CENTER_NAME,
    parent: { _id: districtHospital._id },
    contact: { _id: primaryContact._id },
  });

  expectPersonUnderHealthCenter(primaryContact, PRIMARY_CONTACT_NAME, healthCenter, districtHospital);
  staff.forEach((staffMember, i) => expectPersonUnderHealthCenter(
    staffMember, staffNames[i], healthCenter, districtHospital
  ));
};

describe('Health Center Create form', () => {
  it('creates the health center, its new parent district hospital, and its primary contact', async () => {
    const { errors, contacts } = await fillForm();

    expect(errors).to.be.empty;
    expectCreatedContacts(contacts);
  });

  it('creates additional staff members as children of the health center', async () => {
    const { errors, contacts } = await fillForm([STAFF_NAMES.length, ...STAFF_NAMES]);

    expect(errors).to.be.empty;
    expectCreatedContacts(contacts, STAFF_NAMES);
  });

  it('requires the health center name', async () => {
    const { errors, contacts } = await harness.fillContactCreateForm(CONTACT_TYPE, ['']);

    expect(errors).to.deep.equal([REQUIRED_NAME_ERROR]);
    expect(contacts).to.be.empty;
  });

  it('requires the primary contact name', async () => {
    const { errors, contacts } = await harness.fillContactCreateForm(CONTACT_TYPE, [HEALTH_CENTER_NAME], ['']);

    expect(errors).to.deep.equal([REQUIRED_NAME_ERROR]);
    expect(contacts).to.be.empty;
  });

  it('requires a name for each staff member that is added', async () => {
    const { errors, contacts } = await harness.fillContactCreateForm(
      CONTACT_TYPE,
      [HEALTH_CENTER_NAME],
      [PRIMARY_CONTACT_NAME],
      [1],
    );

    expect(errors).to.deep.equal([REQUIRED_NAME_ERROR]);
    expect(contacts).to.be.empty;
  });
});

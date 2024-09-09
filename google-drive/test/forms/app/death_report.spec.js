const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'death_report';

const CONTACT = {
  _id: 'patient_id',
  name: 'Current Patient',
  parent: {
    parent: {
      contact: {
        name: 'chw',
        phone: '+123456789',
      }
    }
  },
  patient_id: '123456',
  sex: 'female',
  short_name: 'Current',
};

describe('Death Report form', () => {
  const now = new Date();
  const dateOfDeath = now.toISOString().split('T')[0];
  const dateOfBirth = new Date(new Date().setFullYear(now.getFullYear() - 33)).toISOString().split('T')[0];
  const contact = {
    ...CONTACT,
    date_of_birth: dateOfBirth,
  };

  it('submits form successfully', async () => {
    const death_details = {
      date_of_death: dateOfDeath,
      place_of_death: 'other',
      place_of_death_other: 'somewhere else',
      death_information: 'relevant information'
    };

    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      {
        form,
        subject: contact,
      },
      [
        death_details.date_of_death,
        death_details.place_of_death,
        death_details.place_of_death_other,
        death_details.death_information
      ],
      []
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      data: {
        __date_of_death: dateOfDeath,
        __death_information: 'relevant information',
        __place_of_death: 'other',
        __place_of_death_other: 'somewhere else',
        meta: {
          __household_uuid: '',
          __patient_id: '',
          __patient_uuid: 'default_subject',
          __source: 'action',
          __source_id: ''
        }
      },
      death_details,
      group_review: {
        blank_note: '',
        c_patient_age: '33 years old',
        r_death_info: '',
        r_key_instruction: '',
        r_patient_details: '',
        r_referral: '',
        r_summary_details: '',
        r_undo: '',
        submit: '',
      },
      inputs: {
        contact,
        source: 'action',
        source_id: '',
      },
      patient_age_in_days: '12053',
      patient_age_in_months: '396',
      patient_age_in_years: '33',
      patient_display_name: `${contact.name} (${contact.short_name})`,
      patient_id: contact.patient_id,
      patient_name: contact.name,
      patient_short_name: contact.short_name,
      patient_uuid: contact._id,
    });
  });
});

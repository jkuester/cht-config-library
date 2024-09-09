const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'death_report';

describe('Death Report form', () => {
  const dateOfDeath = new Date().toISOString().split('T')[0];

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
      form,
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
        c_patient_age: '54 years old',
        r_death_info: '',
        r_key_instruction: '',
        r_patient_details: '',
        r_referral: '',
        r_summary_details: '',
        r_undo: '',
        submit: '',
      },
      inputs: {
        contact: {
          _id: 'default_subject',
          date_of_birth: '0',
          name: '',
          parent: {
            parent: {
              contact: {
                name: '',
                phone: '',
              }
            }
          },
          patient_id: '',
          sex: '',
          short_name: '',
        },
        source: 'action',
        source_id: '',
      },
      patient_age_in_days: 'NaN',
      patient_age_in_months: '655',
      patient_age_in_years: '54',
      patient_display_name: '',
      patient_id: '',
      patient_name: '',
      patient_short_name: '',
      patient_uuid: 'default_subject',
    });
  });
});

const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

const form = 'death_report';

describe('Death Report form', () => {
  const dateOfDeath = new Date();

  it('submits form successfully', async () => {
    const death_details = {
      date_of_death: dateOfDeath.toISOString().split('T')[0],
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
    expect(fields).to.deep.include({ death_details });
  });
});

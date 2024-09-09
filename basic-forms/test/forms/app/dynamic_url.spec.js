const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'dynamic_url';

describe('Dynamic URL form', () => {
  it('can successfully submit the form', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      { 
        form,
        content: { app_link: {
          app_query: 'patient_id',
          name: 'Current Patient'
        } } // Simulate user selection by providing contact data
      },
      ['hello world'],
      ['+254712345678'],
      []
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    
    expect(fields).excludingEvery('meta').to.deep.equal({
      web_link: {
        web_query: 'hello world',
        link: '',
      },
      phone_link: {
        phone_query: '+254712345678',
        link: '',
      },
      app_link: {
        app_query: 'patient_id',
        name: 'Current Patient',
        link: '',
      },
    });
  });
});

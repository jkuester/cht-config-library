const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'with_contact_summary';

const allChws = [
  { name: 'CHW1', household_visits: 1, referrals: 2 },
  { name: 'CHW2', household_visits: 3, referrals: 4},
  { name: 'CHW3', household_visits: 0, referrals: 0}
];

describe('Test Contact Summary form', () => {
  it('loads all structured contact summary data', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form }); // Context from contact-summary.templated used

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({ my_page: {
      favorite_chw_name: allChws[0].name,
      favorite_chw_hh_visits: `${allChws[0].household_visits}`,
      favorite_chw_referrals: `${allChws[0].referrals}`,
      chw_names: allChws.map(({ name }) => name).join(' '),
      chw_household_visits: allChws.map(({ household_visits }) => household_visits).join(' '),
      chw_referrals: allChws.map(({ referrals }) => referrals).join(' '),
      favorite_note: '',
      chw_count: '3',
      my_repeat: allChws.map((chw, index) => ({
        chw_household_visit: `${chw.household_visits}`,
        chw_index: `${index}`,
        chw_name: chw.name,
        chw_referral: `${chw.referrals}`,
        repeated_note: ''
      }))
    } });
  });

  it('loads available structured contact summary data when not all is available', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form, contactSummary: { context: {
      favorite_chw: allChws[0],
      all_chws: {
        chw_names: allChws[0].name,
        chw_household_visits: allChws[0].household_visits,
        chw_referrals: allChws[0].referrals
      }
    } }  });

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({ my_page: {
      favorite_chw_name: allChws[0].name,
      favorite_chw_hh_visits: `${allChws[0].household_visits}`,
      favorite_chw_referrals: `${allChws[0].referrals}`,
      chw_names: allChws[0].name,
      chw_household_visits: `${allChws[0].household_visits}`,
      chw_referrals: `${allChws[0].referrals}`,
      favorite_note: '',
      chw_count: '1',
      my_repeat: [{
        chw_household_visit: `${allChws[0].household_visits}`,
        chw_index: '0',
        chw_name: allChws[0].name,
        chw_referral: `${allChws[0].referrals}`,
        repeated_note: ''
      }]
    } });
  });

  it('submits successfully with no contact summary data', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm({ form, contactSummary: { context: { } } });

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({ my_page: {
      favorite_chw_name: '',
      favorite_chw_hh_visits: '',
      favorite_chw_referrals: '',
      chw_names: '',
      chw_household_visits: '',
      chw_referrals: '',
      favorite_note: '',
      chw_count: '0',
    } });
  });
});

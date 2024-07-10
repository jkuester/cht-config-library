const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

describe('contact summary', () => {
  it('context', async () => {
    const { context } = await harness.getContactSummary();

    expect(context).to.deep.equal({
      favorite_chw: { name: 'CHW1', household_visits: 1, referrals: 2 },
      all_chws: {
        chw_names: 'CHW1 CHW2 CHW3',
        chw_household_visits: '1 3 0',
        chw_referrals: '2 4 0'
      }
    });
  });
});

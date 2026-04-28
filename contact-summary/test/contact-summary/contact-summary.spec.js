const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

describe('contact summary', () => {
  it('emits successfully', async () => {
    const summary = await harness.getContactSummary();

    expect(summary).to.deep.equal({
      cards: [
        {
          fields: [
            {
              label: 'Description',
              value: 'This contact summary card is shown for all contacts.'
            }
          ],
          label: 'Always Shown'
        }
      ],
      context: {
        favorite_chw: { name: 'CHW1', household_visits: 1, referrals: 2 },
        all_chws: {
          chw_names: 'CHW1 CHW2 CHW3',
          chw_household_visits: '1 3 0',
          chw_referrals: '2 4 0'
        }
      },
      fields: []
    });
  });
});

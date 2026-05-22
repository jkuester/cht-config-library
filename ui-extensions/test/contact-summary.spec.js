const { expect } = require('chai');
const { harness } = require('../../util/test-harness');

describe('contact summary', () => {
  it('emits successfully', async () => {
    const summary = await harness.getContactSummary();

    expect(summary).to.deep.equal({
      cards: [],
      context: {
        contact_id: 'default_subject'
      },
      fields: []
    });
  });
});

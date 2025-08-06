const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

describe('contact summary', () => {
  it('fields', async () => {
    const { fields } = await harness.getContactSummary();

    expect(fields).to.deep.equal([
      { label: 'Child Count', value: '', width: 4 }
    ]);
  });
});

const TestHarness = require('cht-conf-test-harness');
const { expect } = require('chai');
const harness = new TestHarness();

module.exports = {
  harness,
  mochaHooks: {
    beforeAll: async () => await harness.start(),
    afterAll: async () => await harness.stop(),
    beforeEach: async () => await harness.clear(),
    afterEach: () => expect(harness.consoleErrors).to.be.empty,
  }
};

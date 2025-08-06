const sinon = require('sinon');

module.exports = {
  mochaHooks: {
    afterEach: () => {
      sinon.restore();
    },
  }
};

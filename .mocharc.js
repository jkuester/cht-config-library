const chai = require('chai');
const chaiExclude = require('chai-exclude');
const sinonChai = require('sinon-chai');

chai.use(chaiExclude);
chai.use(sinonChai);

module.exports = {
  require: [
    '../util/test-harness.js',
    '../util/hooks.js'
  ]
};

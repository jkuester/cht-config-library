const chai = require('chai');
const chaiExclude = require('chai-exclude');

chai.use(chaiExclude);

module.exports = {
  require: ['../util/test-harness.js']
};

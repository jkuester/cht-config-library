const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'comparing_values';

describe('Comparing Values form', () => {

  [
    'HeLlO WoRlD',
    'HELLO WORLD',
    'hello world',
  ].forEach((value) => {
    it('considers strings equal when letters match regardless of case', async () => {
      const {
        errors,
        report: { fields },
        additionalDocs
      } = await harness.fillForm(
        form,
        [],
        [value],
      );

      expect(errors).to.be.empty;
      expect(additionalDocs).to.be.empty;
      expect(fields).excluding(['meta']).to.deep.equal({
        intro: '',
        case_insensitive: {
          description: '',
          value_a: 'Hello World',
          value_b: value,
          is_equal: 'true',
          description_conclusion: { equal: '' },
        },
      });
    });
  });

  it('considers strings not equal when letters do not match', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      form,
      [],
      ['Hello Worlb'],
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excluding(['meta']).to.deep.equal({
      intro: '',
      case_insensitive: {
        description: '',
        value_a: 'Hello World',
        value_b: 'Hello Worlb',
        is_equal: 'false',
        description_conclusion: { not_equal: '' },
      },
    });
  });
});

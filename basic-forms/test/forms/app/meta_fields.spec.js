const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');

const form = 'meta_fields';

// Midday UTC so the local date is the same in any timezone the tests run in
const NOW = '2026-03-15T12:00:00.000Z';
const TODAY = '2026-03-15';

// e.g. 2026-03-15T07:00:00.000-05:00 (the offset depends on the timezone the tests run in)
const ISO_DATE_TIME_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/;

const expectTimestamp = (value, expectedTime) => {
  expect(value).to.match(ISO_DATE_TIME_WITH_OFFSET);
  expect(new Date(value).getTime()).to.equal(expectedTime);
};

describe('Meta Fields form', () => {
  it('populates start, end, and today from the current time', async () => {
    await harness.setNow(NOW);
    const {
      errors,
      report: { fields, reported_date },
      additionalDocs
    } = await harness.fillForm(form, []);

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      intro: '',
      start: fields.start,
      end: fields.end,
      today: TODAY,
    });
    expectTimestamp(fields.start, harness.getNow());
    expectTimestamp(fields.end, harness.getNow());
    expect(reported_date).to.equal(harness.getNow());
  });
});

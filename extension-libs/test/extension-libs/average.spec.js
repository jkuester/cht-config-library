const { expect } = require('chai');
const average = require('../../extension-libs/average');

describe('Extension Lib: average', () => {
  [
    [{ t: 'num', v: 1 }, { t: 'num', v: 3 }],
    [{ t: 'str', v: '1' }, { t: 'arr', v: [{ textContent: '3' }] }]
  ].forEach(([first, second]) => {
    it('calculates the average of two numbers', () => {
      const avg = average(first, second);
      expect(avg).to.deep.equal({ t: 'num', v: 2 });
    });
  });

  [
    [{ t: 'arr', v: [] }, { t: 'num', v: 3 }],
    [{ t: 'num', v: 1 }, { t: 'arr', v: [{}] }],
    [{ t: 'num', v: 1 }, { t: 'arr', v: [3] }]
  ].forEach(([first, second]) => {
    it('returns NaN when a number is not provided', () => {
      const avg = average(first, second);
      expect(avg).to.deep.equal({ t: 'num', v: NaN });
    });
  });
});

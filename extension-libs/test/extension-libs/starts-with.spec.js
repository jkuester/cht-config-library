const { expect } = require('chai');
const startsWith = require('../../extension-libs/starts-with');

describe('Extension Lib: starts-with', () => {
  [
    [{ t: 'str', v: 'hel' }, { t: 'str', v: 'hello' }],
    [{ t: 'arr', v: [{ textContent: 'hel' }] }, { t: 'str', v: 'hello' }],
    [{ t: 'str', v: 'hel' }, { t: 'arr', v: [{ textContent: 'hello' }] }],
    [{ t: 'arr', v: [{ textContent: 'hel' }] }, { t: 'arr', v: [{ textContent: 'hello' }] }],
  ].forEach(([prefix, value]) => {
    it('returns true when value starts with prefix', () => {
      const result = startsWith(prefix, value);
      expect(result).to.deep.equal({ t: 'bool', v: true });
    });
  });

  [
    [{ t: 'str', v: 'world' }, { t: 'str', v: 'hello' }],
    [{ t: 'arr', v: [{ textContent: 'world' }] }, { t: 'str', v: 'hello' }],
    [{ t: 'str', v: 'world' }, { t: 'arr', v: [{ textContent: 'hello' }] }],
  ].forEach(([prefix, value]) => {
    it('returns false when value does not start with prefix', () => {
      const result = startsWith(prefix, value);
      expect(result).to.deep.equal({ t: 'bool', v: false });
    });
  });

  it('returns true when prefix is empty string', () => {
    const result = startsWith({ t: 'str', v: '' }, { t: 'str', v: 'hello' });
    expect(result).to.deep.equal({ t: 'bool', v: true });
  });

  it('returns true when both are empty strings', () => {
    const result = startsWith({ t: 'str', v: '' }, { t: 'str', v: '' });
    expect(result).to.deep.equal({ t: 'bool', v: true });
  });

  it('returns empty string for arr with empty array', () => {
    const result = startsWith({ t: 'arr', v: [] }, { t: 'str', v: 'hello' });
    expect(result).to.deep.equal({ t: 'bool', v: true });
  });

  it('returns empty string for arr with missing textContent', () => {
    const result = startsWith({ t: 'arr', v: [{}] }, { t: 'str', v: 'hello' });
    expect(result).to.deep.equal({ t: 'bool', v: true });
  });
});

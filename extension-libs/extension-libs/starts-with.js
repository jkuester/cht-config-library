const asString = (r) => {
  if (r.t === 'arr') {
    return r.v.length ? r.v[0].textContent || '' : '';
  } else if (r.v !== null) {
    return r.v.toString();
  }
  return (r || '').toLowerCase();
};

module.exports = (prefix, value) => {
  const prefixString = asString(prefix);
  const valueString = asString(value);
  const startsWith = valueString.startsWith(prefixString);
  if (value.v !== null) {
    return {
      t: 'bool',
      v: startsWith
    };
  }
  return startsWith;
};

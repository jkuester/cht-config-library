const asString = (r) => {
  if (r.t === 'arr') {
    return r.v.length ? r.v[0].textContent || '' : '';
  }
  return r.v.toString();
};

const asNumber = (r) => {
  if (r.t === 'num') {
    return r.v;
  }

  const str = asString(r).trim();
  if (str === '') {
    return NaN;
  }
  return +str;
};

module.exports = function(first, second) {
  const average = (asNumber(first) + asNumber(second)) / 2;
  return {
    t: 'num',
    v: average
  };
};

const getValue = function(obj) {
  let val;
  if (obj.t === 'arr') {
    val = obj.v && obj.v.length && obj.v[0];
  } else {
    val = obj.v;
  }
  if (!val) {
    return 0;
  }
  const parsed = parseInt(val.textContent);
  return isNaN(parsed) ? 0 : parsed;
};

module.exports = function(first, second) {
  const average = (getValue(first) + getValue(second)) / 2;
  return {
    t: 'num',
    v: average
  };
};

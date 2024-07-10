const ALL_CHWS = [
  { name: 'CHW1', household_visits: 1, referrals: 2 },
  { name: 'CHW2', household_visits: 3, referrals: 4},
  { name: 'CHW3', household_visits: 0, referrals: 0}
];

module.exports = {
  fields: [],
  cards: [],
  context: {
    // Data nested in objects can be parsed in forms
    favorite_chw: ALL_CHWS[0],
    // Arrays are difficult to parse in forms, so normalize the data into space-separated strings
    all_chws: {
      chw_names: ALL_CHWS.map(({ name }) => name).join(' '),
      chw_household_visits: ALL_CHWS.map(({ household_visits }) => household_visits).join(' '),
      chw_referrals: ALL_CHWS.map(({ referrals }) => referrals).join(' ')
    }
  }
};

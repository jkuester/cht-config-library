const populateChildCount = cht.v1.getExtensionLib('child-count.js');
populateChildCount && populateChildCount('Child Count', contact._id);

module.exports = {
  fields: [
    { appliesToType: '!person', label: 'Child Count', value: '', width: 4 },
  ],
  cards: [],
  context: {}
};

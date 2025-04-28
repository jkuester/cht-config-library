cht.v1.getExtensionLib('child-count.js')('Child Count', contact._id);

module.exports = {
  fields: [
    { appliesToType: '!person', label: 'Child Count', value: '', width: 4 },
  ],
  cards: [],
  context: {}
};

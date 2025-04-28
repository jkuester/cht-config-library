/* global document, window */

const getSelector = label => {
  const classes = label
    .toLowerCase()
    .replace(/\./g, '\\.')
    .split(/\s+/);
  return `#contact_summary .cell.${classes.join('.')} > div > p`;
};

const getChildCount = async (db, contactId) => db
  .query('medic-client/contacts_by_parent', {
    startkey: [contactId],
    endkey: [contactId, {}]
  })
  .then(({ rows }) => rows.length);

const setChildCount = async (label, contactId) => {
  const element = document.querySelector(getSelector(label));
  const dbSvc = window && window.CHTCore && window.CHTCore.DB;
  if (!element || !dbSvc) {
    return;
  }
  element.textContent = await getChildCount(dbSvc.get(), contactId);
};

// Timeout to allow the DOM to be ready
module.exports = (label, contactId) => setTimeout(() => setChildCount(label, contactId));

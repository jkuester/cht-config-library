/* global document, window */
const SELECTOR = '#contact_summary .cell.child.count > div > p';

const getChildCount = async (db, contactId) => db
  .query('medic-client/contacts_by_parent', {
    startkey: [contactId],
    endkey: [contactId, {}]
  })
  .then(({ rows }) => rows.length);

const setChildCount = async (contact) => {
  const element = document.querySelector(SELECTOR);
  const dbSvc = window.CHTCore.DB;
  if (!element || !dbSvc) {
    return;
  }
  element.textContent = await getChildCount(dbSvc.get(), contact._id);
};

// Timeout to allow the DOM to be ready
module.exports = (contact) => setTimeout(() => setChildCount(contact));

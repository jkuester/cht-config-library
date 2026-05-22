/* global HTMLElement */

const escapeHtml = (text) => String(text)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const TEMPLATE = (text, disabled, status) => `
  <style>
    :host {
      display: block;
      padding: 1rem;
      font-family: sans-serif;
    }
    h2 { margin-top: 0; }
    textarea {
      width: 100%;
      box-sizing: border-box;
      font: inherit;
      padding: 0.5rem;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    button[disabled] { cursor: not-allowed; opacity: 0.6; }
    .status { color: #555; font-size: 0.9rem; }
  </style>
  <h2>My Notes</h2>
  <textarea id="notes" rows="10" ${disabled ? 'disabled' : ''}>${escapeHtml(text)}</textarea>
  <div class="row">
    <button id="save" ${disabled ? 'disabled' : ''}>Save</button>
    <span id="status" class="status">${escapeHtml(status)}</span>
  </div>
`;

module.exports = class NotesExtension extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this._render('', true, 'Loading…');
    try {
      const userContact = await this.cht.v1.person.getByUuid(this.inputs.userContactSummary.contact_id);
      if (!userContact) {
        this._render('', true, 'No contact associated with the current user.');
        return;
      }
      this._render(userContact.notes || this.inputs.config.default_note, false, '');
    } catch (err) {
      this._render('', true, `Failed to load notes: ${err.message}`);
    }
  }

  _render(text, disabled, status) {
    this.shadowRoot.innerHTML = TEMPLATE(text, disabled, status);
    const saveButton = this.shadowRoot.getElementById('save');
    if (saveButton && !disabled) {
      saveButton.addEventListener('click', () => this._save());
    }
  }

  async _save() {
    const textarea = this.shadowRoot.getElementById('notes');
    const button = this.shadowRoot.getElementById('save');
    const statusEl = this.shadowRoot.getElementById('status');
    const notes = textarea.value;

    textarea.disabled = true;
    button.disabled = true;
    statusEl.textContent = 'Saving…';

    try {
      const latest = {
        ...(await this.cht.v1.person.getByUuid(this.inputs.userContactSummary.contact_id)),
        notes
      };
      await this.cht.v1.person.update(latest);
      statusEl.textContent = 'Saved.';
    } catch (err) {
      statusEl.textContent = `Failed to save: ${err.message}`;
    } finally {
      textarea.disabled = false;
      button.disabled = false;
    }
  }
};

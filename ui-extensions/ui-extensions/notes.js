/* global window, HTMLElement */

const escapeHtml = (text) => String(text)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

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

class NotesExtension extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this._render('', true, 'Loading…');
    try {
      // TODO Load the id from userContactSummary?
      // TODO Should we only be passing the `context` data?
      console.log(this.inputs.userContactSummary);
      this._userContact = await this.cht.v1.person.getByUuid('c3f6b91e-b095-48ef-a524-705e29fd9f6d');
      if (!this._userContact) {
        this._render('', true, 'No contact associated with the current user.');
        return;
      }
      this._render(this._userContact.notes || '', false, '');
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
    const noteText = textarea.value;

    textarea.disabled = true;
    button.disabled = true;
    statusEl.textContent = 'Saving…';

    try {
      const latest = await this.cht.v1.person.getByUuid(this._userContact._id);
      latest.notes = noteText;
      this._userContact = await this.cht.v1.person.update(latest);
      statusEl.textContent = 'Saved.';
    } catch (err) {
      statusEl.textContent = `Failed to save: ${err.message}`;
    } finally {
      textarea.disabled = false;
      button.disabled = false;
    }
  }
}

module.exports = NotesExtension;

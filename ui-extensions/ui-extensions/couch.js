/* global HTMLElement */

module.exports = class AdminOnly extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          width: calc(100% + 30px);
          margin-left: -15px;
          margin-right: -15px;
          height: 100vh;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }
      </style>
      <div class="container">
        <iframe src="/_utils/"></iframe>
      </div>
    `;
  }
};

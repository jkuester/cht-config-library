/* global HTMLElement */

const toBlobUrl = ({ data, content_type }) => {
  const bytes = Uint8Array.from(atob(data), c => c.codePointAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: content_type }));
};

module.exports = class WithResources extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const title = this.cht.v1.translate('ui-extension.with-resources.heading', { count: 3 });
    const sampleImage = this.cht.v1.getResource('image-sample');
    const sampleAudio = this.cht.v1.getResource('audio-sample');
    const sampleVideo = this.cht.v1.getResource('video-sample');

    this.shadowRoot.innerHTML = `
      <style>
        .container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 16px;
        }
        .card {
          background-color: #ffffff;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.14);
          padding: 16px 24px;
        }
        h2 {
          margin-top: 0;
          margin-bottom: 0;
        }
        h3 {
          margin-top: 0;
        }
      </style>
      <div class="container">
        <div class="card"><h2>${title}</h2></div>
        <div class="card">
          <h3>Image:</h3>
          <img src="data:${sampleImage.content_type};base64,${sampleImage.data}" alt="Resource Image">
        </div>
        <div class="card">
          <h3>Audio:</h3>
          <audio controls src="${toBlobUrl(sampleAudio)}"></audio>
        </div>
        <div class="card">
          <h3>Video:</h3>
          <video controls style="max-width: 300px;" src="${toBlobUrl(sampleVideo)}"></video>
        </div>
      </div>
    `;
  }
};

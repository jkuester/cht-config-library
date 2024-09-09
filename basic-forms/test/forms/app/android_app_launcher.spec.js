const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');
const { readFile} = require('fs').promises;
const Path = require('path');

const form = 'android_app_launcher';

describe('Android App Launcher form', () => {
  it('submits form successfully', async () => {
    // Cannot fully test android app functionality here (since we are not running in an Android environment).
    // Instead, we inject values for the data that would be populated by the Android intents (allowing for testing any
    // down-stream form logic).
    const base64ImageFile = (await readFile(Path.resolve(__dirname, 'base64_image.txt')))
      .toString()
      .trim();
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      { form, content: {
        camera_image: { camera_app: { camera_app_outputs: { data: base64ImageFile } } },
        qr_code: { qr_code_app: { qr_code_app_outputs: { SCAN_RESULT: 'fake qr code' } } },
      } },
      [],
      [],
      []
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    expect(fields).excludingEvery('meta').to.deep.equal({
      intro: '',
      camera_image: {
        camera_app: {
          action: 'android.media.action.IMAGE_CAPTURE',
          camera_app_outputs: { data: base64ImageFile }
        }
      },
      qr_code: {
        qr_code_app: {
          action: 'com.google.zxing.client.android.SCAN',
          qr_code_app_outputs: { SCAN_RESULT: 'fake qr code' }
        }
      },
    });
  });
});

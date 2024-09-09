const { expect } = require('chai');
const { harness } = require('../../../../util/test-harness');
const { readFile} = require('fs').promises;
const Path = require('path');

const form = 'embedded_multimedia';

describe('Embedded Multimedia form', () => {
  it('submits form successfully', async () => {
    const {
      errors,
      report: { fields },
      additionalDocs
    } = await harness.fillForm(
      form,
      ['image', 'audio', 'video'],
      ['croc', 'eagle', 'frog', 'whale', 'croc'],
      [],
      []
    );

    expect(errors).to.be.empty;
    expect(additionalDocs).to.be.empty;
    const base64ImageFile = (await readFile(Path.resolve(__dirname, 'base64_image.txt')))
      .toString()
      .trim();
    expect(fields).excludingEvery('meta').to.deep.equal({
      questions_with_media: {
        image_question: 'image',
        audio_question: 'audio',
        video_question: 'video'
      },
      selects_with_media: {
        include_files_note: '',
        select_media: 'croc',
        select_media_no_buttons: 'eagle',
        select_media_no_buttons_columns: 'frog',
        animals_table: {
          table_note: '',
          animals_brian: 'whale',
          animals_michael: 'croc',
          generated_table_list_label_15: '',
          reserved_name_for_field_list_labels_17: ''
        }
      },
      notes_with_media: {
        image_note: '',
        base64_note: base64ImageFile,
        fa_note: '',
        svg_note: '',
        inline_image_note: '',
      },
      summary_with_media: {
        summary_note: '',
        fa_header: '',
        svg_header: '',
        inline_image_header: '',
      }
    });
  });
});

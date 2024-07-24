const { expect } = require('chai');
const { harness } = require('../../../util/test-harness');

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
    expect(fields).to.deep.include({
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

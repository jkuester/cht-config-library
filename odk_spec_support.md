# ODK Spec Support in CHT

// TODO Also can include list of supported appearances

## type

| type                                     | CHT | Notes                                                                                                                                                                      |
|------------------------------------------|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| text                                     | Yes |                                                                                                                                                                            |
| integer                                  | Yes |                                                                                                                                                                            | 
| decimal                                  | Yes |                                                                                                                                                                            |
| note                                     | Yes |                                                                                                                                                                            |
| calculate                                | Yes |                                                                                                                                                                            |
| select_one                               | Yes |                                                                                                                                                                            |
| select_multiple list_name                | Yes |                                                                                                                                                                            |
| select_one_from_file file.extension      |     |                                                                                                                                                                            |
| select_multiple_from_file file.extension |     |                                                                                                                                                                            |
| begin_repeat                             | Yes |                                                                                                                                                                            |
| end_repeat                               | Yes |                                                                                                                                                                            |
| begin_group                              | Yes |                                                                                                                                                                            |
| end_group                                | Yes |                                                                                                                                                                            |
| geopoint                                 | Yes |                                                                                                                                                                            |
| geotrace                                 | Yes |                                                                                                                                                                            |
| geoshape                                 | Yes |                                                                                                                                                                            |
| start-geopoint                           | ?   |                                                                                                                                                                            |
| range                                    | Yes |                                                                                                                                                                            |
| image                                    | Yes |                                                                                                                                                                            |
| barcode                                  |     | It is possible to read barcode data in a form using the [Android app integration](https://docs.communityhealthtoolkit.org/apps/reference/forms/app/#android-app-launcher). |
| audio                                    | Yes |                                                                                                                                                                            |
| background-audio                         |     |                                                                                                                                                                            |
| video                                    | Yes |                                                                                                                                                                            |
| file                                     | Yes |                                                                                                                                                                            |
| date                                     | Yes |                                                                                                                                                                            |
| time                                     | Yes |                                                                                                                                                                            |
| datetime                                 | Yes |                                                                                                                                                                            |
| rank                                     | Yes |                                                                                                                                                                            |
| csv-external                             |     |                                                                                                                                                                            |
| acknowledge                              | Yes |                                                                                                                                                                            |
| start                                    | Yes |                                                                                                                                                                            |
| end                                      |     | Defective in CHT. Gets filled in with the same value as `start`. https://github.com/medic/cht-core/issues/8974                                                                               |
| today                                    | Yes |                                                                                                                                                                            |
| deviceid                                 |     |                                                                                                                                                                            |
| username                                 |     |                                                                                                                                                                            |
| phonenumber                              |     |                                                                                                                                                                            |
| email                                    |     |                                                                                                                                                                            |
| audit                                    |     |                                                                                                                                                                            |

## appearance

| Appearance name | Type(s) used with                                 | CHT | Notes                                                                                                                                     |
|-----------------|---------------------------------------------------|-----|-------------------------------------------------------------------------------------------------------------------------------------------|
| numbers         | text                                              | Yes |                                                                                                                                           |
| multiline       | text                                              | Yes |                                                                                                                                           |
| url             | text                                              | Yes |                                                                                                                                           |
| ex:             | text, integer, decimal, image, audio, video, file |     | Use the [Android app integration](https://docs.communityhealthtoolkit.org/apps/reference/forms/app/#android-app-launcher) to launch apps. |
| thousands-sep   | integer, decimal, text numbers                    | Yes |                                                                                                                                           |
| bearing         | decimal                                           |     |                                                                                                                                           |
| vertical        | range                                             | Yes |                                                                                                                                           |
| no-ticks        | range                                             | Yes |                                                                                                                                           |
| picker          | range                                             | Yes |                                                                                                                                           |
| rating          | range                                             | Yes |                                                                                                                                           |
| new             | image audio video                                 | ?   |                                                                                                                                           |
| new-front       | image                                             | ?   |                                                                                                                                           |
| draw            | image                                             | Yes |                                                                                                                                           |
| annotate        | image                                             | Yes |                                                                                                                                           |
| signature       | image                                             | Yes |                                                                                                                                           |
| no-calendar     | date datetime                                     | ?   |                                                                                                                                           |
| month-year      | date                                              | ?   |                                                                                                                                           |
| year            | date                                              | ?   |                                                                                                                                           |
| ethiopian       | date                                              | ?   |                                                                                                                                           |
| coptic          | date                                              | ?   |                                                                                                                                           |
| islamic         | date                                              | ?   |                                                                                                                                           |
| bikram-sambat   | date                                              | ?   |                                                                                                                                           |
| myanmar         | date                                              | ?   |                                                                                                                                           |
| persian         | date                                              | ?   |                                                                                                                                           |
| placement-map   | geopoint                                          | Yes |                                                                                                                                           |
| maps            | geopoint                                          | Yes |                                                                                                                                           |
| hide-input      | geopoint geotrace geoshape                        | Yes |                                                                                                                                           |
| minimal         | all selects                                       | Yes |                                                                                                                                           |
| search          | all selects                                       | Yes | Only supported on select_one.                                                                                                             |
| quick           | select_one select_one_from_file                   |     |                                                                                                                                           |
| columns-pack    | all selects                                       | Yes |                                                                                                                                           |
| columns         | all selects                                       | Yes |                                                                                                                                           |
| columns-n       | all selects                                       | Yes |                                                                                                                                           |
| no-buttons      | all selects                                       | Yes |                                                                                                                                           |
| image-map       | all selects                                       | ?   |                                                                                                                                           |
| likert          | select_one select_one_from_file                   | Yes |                                                                                                                                           |
| map             | select_one select_one_from_file                   |     |                                                                                                                                           |
| field-list      | begin_group begin_repeat                          | Yes | Only applies when style = "pages".                                                                                                        |
| label           | all selects                                       | Yes |                                                                                                                                           |
| list-nolabel    | all selects                                       | Yes |                                                                                                                                           |
| list            | all selects                                       | Yes |                                                                                                                                           |
| table-list      | begin_group                                       | Yes |                                                                                                                                           |
| hidden-answer   | barcode                                           |     |                                                                                                                                           |
| printer         | text                                              |     |                                                                                                                                           |
| masked          | text                                              |     |                                                                                                                                           |


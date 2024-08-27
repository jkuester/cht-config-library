# Case ID

Basic configuration for a `case_id` workflow using the [registration](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/transitions/#registration) and [accept_case_reports](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/transitions/#accept-case-reports) transitions.  

Cases are created by submitting the `register_case` form for a person contact. This form will trigger the `registration` transition to populate the `register_case` report with a unique `case_id` value as well as a `place_uuid` value (which will be set to the `parent` of the person associated with the `register_case` report).

Then, `case_event` reports can be submitted using the `case_id` value from the `register_case` report. These reports will trigger the `accept_case_reports` transition to associate the `case_event` report with the `place_uuid` value from the `register_case` report. Unfortunately, due to [this issue](https://github.com/medic/cht-core/issues/9381), it seems that the `place_uuid` value is saved correctly in the `case_event` report.

Note that in the "Reports" tab, the `case_id` value displayed for both the `register_case` and `case_event` reports will be clickable. Tapping the `case_id` will automatically filter the listed reports to be only those with the same `case_id`.

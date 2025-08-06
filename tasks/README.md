# Tasks

## `report_task`

Generates a basic `reports` task each time the `trigger_report_task` form is submitted for a contact. The task is resolved by submitting a `resolve_report_task` form. This task and form demonstrate the kind of data that can be passed from a `reports` task to an app form.

## `contact_task`

Generates a basic `contacts` task each time a new `person` is created. The task is resolved by submitting a `resolve_contact_task` form. This task and form demonstrate the kind of data that can be passed from a `contacts` task to an app form.

## `add_household_members_task`

Generates a `contacts` task for new households. This task has two actions. Selecting "Add person to household" will redirect the user to the `contact` form for adding a new person to the household. Selecting "No more household members to add" will open an `app` form where the user can confirm they are done adding members to the household. Submitting the form will resolve the task.

## `add_role_task`

_(Requires CHT `4.21.0+`)_

Generates a simple `contacts` task for new persons that do not have a `role` value. Selecting the task will redirect the user to the `contact` form for modifying the person. When the user adds a `role` value and submits the form, the task will be resolved.

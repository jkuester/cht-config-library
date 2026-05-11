# UI Extensions

[UI Extensions](https://docs.communityhealthtoolkit.org/building/reference/ui-extensions/) are custom web components that extend the CHT web application. Each extension consists of a JavaScript file that exports a `class` extending `HTMLElement` along with a `.properties.json` file describing how the extension should be exposed in the webapp.

## `notes.js`

A minimal "Notes" sidebar tab that lets the logged-in user keep a single persistent note stored on their own contact doc. When the tab is opened, the existing note text (from `notes` field on the user's contact) is rendered in a multi-line textbox. The user can edit the text and click **Save** to write the updated value back to the contact.

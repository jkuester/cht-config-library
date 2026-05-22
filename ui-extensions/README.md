# UI Extensions

[UI Extensions](https://docs.communityhealthtoolkit.org/building/reference/ui-extensions/) are custom web components that extend the CHT web application. Each extension consists of a JavaScript file that exports a `class` extending `HTMLElement` along with a `.properties.json` file describing how the extension should be exposed in the webapp.

## `chw-notes.js`

A minimal "Notes" main header tab that lets the CHW keep a single persistent note stored on their own contact doc. When the tab is opened, the existing note text (from `notes` field on the user's contact) is rendered in a multi-line textbox. The user can edit the text and click **Save** to write the updated value back to the contact.

Demonstrates:

- Loading `this.inputs.userContactSummary` data. The user's `contact_id` must be populated in their contact-summary context.
- Loading `this.inputs.config` data. The `default_note` value is used to pre-populate the note text when one does not already exist for a user.
- Reading/modifying a contact via the [cht-datasource apis](https://docs.communityhealthtoolkit.org/cht-datasource/) (to persist the `notes` property on the contact).
- `"weight": 0` makes this the primary tab for the user, loaded by default when the app opens.
- Only accessible to users with the `chw` role (offline-only).

## `couch.js`

An admin-only sidebar tab that embeds CouchDB's [Fauxton](https://docs.couchdb.org/en/stable/fauxton/index.html) admin UI directly inside the CHT webapp by rendering an `<iframe>` pointing at the same-origin `/_utils/` path.

Demonstrates: 

- Admin-only extension – only accessible to users with the `admin` role.

## `minimal.js`

The smallest possible UI extension – a reference implementation showing the bare-minimum structure required for a CHT UI extension. 

## `with-resources.js`

A demonstration extension that shows how to load and render embedded resources.

Demonstrates:

- Rendering images/audio/video resources loaded via the `this.cht.v1.getResource()` API. Requires the resources to be configured in the `resources.json`.
- Translating page strings via the `this.cht.v1.translate` API. Requires the custom translations to be provided in the `./translations/*` files.

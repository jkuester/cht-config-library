# extension-libs

[Extension libraries](https://docs.communityhealthtoolkit.org/building/reference/extension-libs/) are JavaScript functions cached in the CHT web application giving app developers a powerful tool to extend the CHT. This is an advanced feature and requires an app developer with some software development experience.

## `average.js`

This is a basic extension library intended for use in a form (e.g. the `calculate_average` app form).  It simply returns the average of two given numbers.

## `child-count.js`

This extension library lazy-loads the number of child contacts (aka direct descendants) of the current contact into the related contact summary field displayed on the contact's profile page.  

To be clear, this _does not_ make the child count value available as an actual contact summary field value. It will not be accessible in forms or other places where the contact summary data is consumed. Instead, this functionality is for _display purposes only_ so that the user can see the child count on the contact's profile page.

To use the `child-count.js` extension library, you need to add an entry to your contact-summary `fields` configuration to be populated with the count value (you can set the initial value to the empty string). The value displayed for this field will be populated by the extension library. Then you need to call the `child-count.js` extension-lib function from your `contact-summary.templated` code and pass it the label/translation-key used for the field and the current contact object. That will trigger an async operation to go calculate the child count for the contact and set the value into the DOM. 

## `extended-select-widget.js`

This extension library is a custom Enketo "widget" that overrides a `text` question with a custom `select` element. It demonstrates how an extension library can "hack" into the Enketo lifecycle by taking control of an existing input element.

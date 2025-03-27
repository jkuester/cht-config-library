# extension-libs

[Extension libraries](https://docs.communityhealthtoolkit.org/building/reference/extension-libs/) are blocks of code that are cached with the CHT web application giving app developers a powerful tool to extend the CHT. This is an advanced feature and requires an app developer with some software development experience.

## `average.js`

This ia a basic extension library intended for use in a form (e.g. the `calculate_average` app form).  It simply returns the average of two given numbers.

## `child-count.js`

This extension library lazy-loads the number of child contacts (aka direct descendants) of the current contact into the related contact summary field displayed on the contact's profile page.  

To be clear, this _does not_ make the child count value available as an actual contact summary field value. It will not be accessible in forms or other places where the contact summary data is consumed. Instead, this functionality is for _display purposes only_ so that the user can see the child count on the contact's profile page.

To use the `child-count.js` extension library, you need to add an entry to your contact-summary `fields` configuration with the label "Child Count" (and an empty string value). The value displayed for this field will be populated by the extension library.

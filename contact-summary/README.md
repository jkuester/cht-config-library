# Contact Summary

Example configuration for a [contact-summary](https://docs.communityhealthtoolkit.org/apps/features/contacts/#contact-summary).  See the [reference documentation](https://docs.communityhealthtoolkit.org/apps/reference/contact-page/) and [tutorial](https://docs.communityhealthtoolkit.org/apps/tutorials/contact-summary/) for more information.

## Structured context data

The `favorite_chw` and `all_chws` fields in the contact summary context demonstrate what it looks like to store structured data (objects/arrays) in the context of a contact summary. The `with_contact_summary` app form shows how to load the structured data into the form. Note that as discussed [on the forum](https://forum.communityhealthtoolkit.org/t/dynamically-generating-html-table-using-repeat-groups/3677), our current contact summary logic does not have good support for serializing arrays of fields in a way that can be parsed in a form. Instead, it is better to store the array data in the context as a _space-separated string_. This data can then be parsed in the form as a `nodeset`.

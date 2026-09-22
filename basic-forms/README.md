# Basic forms

This project contains example forms to demonstrate various form features that do not require additional CHT configuration.

The goal of this project is not to encompass all supported form features, but just to provide a convenient reference for non-trivial form features. Of particular interest is non-obvious functionality requiring subtle/specific configuration as well as anything that is unique to the CHT (or non-standard for ODK).

## Additional Documentation

Almost all the official [ODK form Docs](https://docs.getodk.org/form-reference/) are applicable to CHT forms. Additionally, 
the ODK team has provided a [XLSForm Template](https://forum.getodk.org/t/odk-xlsform-template/43459) that is an excellent reference for creating forms.

## Contact forms

### Adding additional contacts

The `health_center-create` form demonstrates how to create additional contacts in a contact form. The `parent` group creates the parent contact for the health center (the district hospital). The `contact` group creates the primary contact for the health center. The `repeat/child` group allows for creating multiple additional contacts as children of the health center. See [the documentation](https://docs.communityhealthtoolkit.org/building/forms/contact/#creating-person-and-place-contacts-in-the-same-form) for more details.

### Profile image

The `health_center-create` form also includes the `profile_image` field for each of the contacts it writes. So, [profile images](https://docs.communityhealthtoolkit.org/building/forms/contact/#profile-image) can be specified even for nested contacts. 

### Hidden top-level groups in a contact form

Historically, structuring the UX of a contact form was challenging because of various assumptions and limitations. Contact data must be recorded in specific top-level groups, but these groups could not be hidden without it creating an empty page in the form.  As of CHT `5.2.0`, this [is no longer the case](https://github.com/medic/cht-core/issues/8226). Now, contact forms can have a fully customizable structure and all the contact data can flow into hidden top-level groups that hold the actual contact data.

The `clinic-create` form reproduces the exact UX behavior of the [default form](https://github.com/medic/cht-core/tree/master/config/default/forms/contact), but with custom top-level groups that collect data from the user and store it in hidden groups for actually writing the contact.  

## Training Cards

See [the documentation](https://docs.communityhealthtoolkit.org/building/training/training-cards/) for more information about training forms. 

The training cards here include the resources [provided in the documentation](https://docs.communityhealthtoolkit.org/building/training/training-cards-resources/).

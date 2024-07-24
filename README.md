# cht-config-library
Library of example CHT configurations

These examples are intended to illustrate certain features of the CHT. The goal is to demonstrate functionality with simplicity and clarity and not to provide comprehensive production-ready configurations that map to real-world use cases.  

## Contributing

Contributions welcome! If you have configuration that you think would be useful to others, please submit a pull request.

Before opening a PR, review the following considerations:

- Location - Where should the configuration be placed? Please consider updating an existing subproject/config instead of adding a new one.
  - Forms that do not require additional CHT configuration should be placed in the `basic-forms` subproject.
  - New subprojects can be added for demonstrating additional features/workflows/
- Focus - The configuration should only include the minimum necessary content to demonstrate the feature.
  - Optimize for clarity and simplicity. If a configuration is complex, consider breaking it into smaller, more focused examples.
  - The functionality should work, but it does not need to be "production-ready" in terms of polish or completeness.
- Testing - Automated tests are required for all configuration. This will help ensure the configuration is valid and continues to work as expected as the CHT evolves. 

## Development Environment

Building this configuration requires the [standard CHT app development environment](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#setup-environment).

Clone this repository:
```shell
git clone https://github.com/jkuester/cht-config-library.git
cd cht-config-library
```

Install the dependencies:
```shell
npm ci
```

Run the linting:
```shell
npm run lint
```

### Testing

Run all the tests:
```shell
npm test
```

To run just the tests for a specific subproject, you can use the NPM scripts from the subproject's `package.json`:

```shell
npm run --prefix basic-forms unittest
```

# Sovendus-Integration-Scripts Developer guide

This repo houses the default implementation for the (landing) page script and the thank you page script.
The scripts are used by our plugins/components e.g. for [Shopify](https://gitlab.sovendus.com/dev/shopify-app), [Wordpress](https://github.com/Sovendus-GmbH/Sovendus-Wordpress-WooCommerce-Voucher-Network-and-Checkout-Benefits-Plugin), [React](https://github.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-Component-for-React), etc.

## Directory Structure

The directory structure is as follows:

- **src/scripts/vanilla** you can find the code of the landing page script and the thank you page script.
- **src/scripts/react** is the code for the React component
- **src/app** is the code for the dev/preview server

## Sovendus packages used

### sovendus-integration-types

Our typescript types for the integration. This package is used in the scripts and in the plugins/components.

[github.com/Sovendus-GmbH/sovendus-integration-types](https://github.com/Sovendus-GmbH/sovendus-integration-types)

### sovendus-integration-settings-ui

This package is used to render the settings UI for the integration and generate settings for the scripts. In this package it is only use in the dev/preview server. The package is used in the plugins/components to render the settings UI.

[github.com/Sovendus-GmbH/sovendus-integration-settings-ui](https://github.com/Sovendus-GmbH/sovendus-integration-settings-ui)

### sovendus-release-tool

This package is used to handle publishing, testing, linting, and building the package.

[github.com/Sovendus-GmbH/sovendus-release-tool](https://github.com/Sovendus-GmbH/sovendus-release-tool)

### sovendus-builder

A wrapper around vite to simplify and standardize the build process. It is used in the scripts and in the plugins/components.

[github.com/Sovendus-GmbH/sovendus-builder](https://github.com/Sovendus-GmbH/sovendus-builder)

## Contributing

If you want to contribute or report issues, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push your branch to your fork.
4. Create a pull request to the main repository and make sure all tests pass.

## Building from Source

To build the project from source, run:

```bash
yarn install
yarn build
```

## Linting & Tests

To run linting and tests, use:

```bash
# either with:
yarn lint && yarn test
# or with:
yarn pub
```

## Developer preview

To test your changes in a real environment, you can use the `dev` script. This will run the nextjs based preview server and watch for changes in the source code.

```bash
yarn dev
```

## Publishing

1. If you have no access to the repository, fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push your branch to your fork.
4. Create a pull request to the main repository.
5. If you have access to the repository, you can publish a new version by running:

    ```bash
    yarn pub
    ```

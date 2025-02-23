# Sovendus-Integration-Scripts Developer guide

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
yarn lint
```

## Publishing

1. Open a pull request to the main repository
2. After the pull request is merged, a new version will be published. We bump the version, create a new tag and push it to the repository, then our pipeline will publish the new version to npm.

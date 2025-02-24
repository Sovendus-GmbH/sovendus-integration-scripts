# Sovendus Integration Page Scripts

Sovendus Integration Page Scripts is a collection of scripts that are used to handle the Sovendus integration. This repository is intended to be used as a dependency for all Sovendus Plugins projects.

## Installation

### With yarn

```bash
yarn add sovendus-integration-page-scripts
```

### With npm

```bash
npm install sovendus-integration-page-scripts
```

## Usage

### (Landing) Page Script

To use the Sovendus Integration (Landing) Page Script, import the necessary modules and initialize them in your project. Here is an example:

```tsx
import { SovendusPage } from 'sovendus-integration-page-scripts';
const sovendusConfig = // TODO: Add config here;
const sovendusPage = new SovendusPage(sovendusConfig);
sovendusPage.main(config, (result) => {
  console.log(result);
});
```

## Conversion / Thank You Page Script

To use the Sovendus Integration Conversion / Thank You Page Script, import the necessary modules and initialize them in your project. Here is an example:

```tsx
import { SovendusThankyouPage } from 'sovendus-integration-page-scripts';
const 

// TODO: Add example here
```

## Contributing

If you want to contribute or report issues, please follow these steps in our developer guide here: [Developer Guide](./readme-dev.md)

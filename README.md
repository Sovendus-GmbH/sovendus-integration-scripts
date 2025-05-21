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

```ts
import type {
  SovendusPageData,
  SovendusPageWindow,
} from "sovendus-integration-types";

import { SovendusPage } from "sovendus-integration-scripts";

const sovPageConfig: SovendusPageConfig = {
  settings: {
    // can be generated with sovendus-integration-settings-ui
    // TODO link to config generator will be added here soon
  },
  integrationType: "custom-integration-1.0.0",
  // Country code used only for Sovendus Optimize
  // ISO 3166-1 alpha-2 country code (e.g. DE, AT, CH)
  country: "DE", 
} 

const onDone = ({ sovPageStatus }: SovendusPageData): void => {
  console.log("Sovendus page is done - sovPageStatus:", sovPageStatus);
};

// note that you can override this class with your own implementation
void new SovendusPage().main(sovPageConfig, onDone);
```

## Conversion / Thank You Page Script

To use the Sovendus Integration Conversion / Thank You Page Script, import the necessary modules and initialize them in your project. Here is an example:

```ts
import type {
  SovendusThankyouPageData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";

import { SovendusThankyouPage } from "sovendus-integration-scripts";

function onDone({ sovThankyouStatus }: SovendusThankyouPageData): void {
  console.log("Sovendus thankyou page is done - sovThankyouStatus:", sovThankyouStatus);
};

const sovThankyouConfig: SovendusThankYouPageConfig = {
  settings: {
    // can be generated with sovendus-integration-settings-ui
    // TODO link to config generator will be added here soon
  },
  integrationType: "custom-integration-1.0.0",
  iframeContainerId: "sovendus-integration-container",
  orderData: {
    // pass on data from the order
    // relevant for:
    //  - automatic accounting for Sovendus Voucher Network
    //  - Sovendus Optimize
  },
  customerData: {
    // pass on data from the orders billing address
    // relevant for:
    //  - Sovendus Voucher Network
    //  - Sovendus Checkout Benefits
    //  - Sovendus Optimize
  },
} 

// note that you can override this class with your own implementation
void new SovendusThankyouPage().main(sovThankyouConfig, onDone);
```

## Contributing

If you want to contribute or report issues, please follow these steps in our developer guide here: [Developer Guide](./readme-dev.md)

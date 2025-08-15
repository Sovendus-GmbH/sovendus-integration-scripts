# Sovendus Integration Scripts

A set of vanilla JS/TS and optional React helpers to integrate Sovendus products on your shop’s Landing and Thank You pages. This package is used by our official plugins and components and can also be used directly in custom integrations.

- Package name: sovendus-integration-scripts
- Types: sovendus-integration-types
- Minified bundle: sovendus-integration-scripts/minified

## Installation

- Yarn

```bash
yarn add sovendus-integration-scripts sovendus-integration-types
```

- npm

```bash
npm install sovendus-integration-scripts sovendus-integration-types
```

## Quick start

### Landing page script

```ts
import type { SovendusPageData, SovendusPageConfig } from "sovendus-integration-types";
import { SovendusPage } from "sovendus-integration-scripts";

const config: SovendusPageConfig = {
  settings: {
    // generate with sovendus-integration-settings-ui
  },
  integrationType: "custom-integration-1.0.0",
  // Optional: ISO 3166-1 alpha-2 country code, used by Sovendus Optimize
  country: "DE",
};

const onDone = ({ sovPageStatus }: SovendusPageData) => {
  console.log("Sovendus page done", { sovPageStatus });
};

new SovendusPage().main(config, onDone);
```

### Conversion / Thank You page script

```ts
import type { SovendusThankyouPageData, SovendusThankYouPageConfig } from "sovendus-integration-types";
import { SovendusThankyouPage } from "sovendus-integration-scripts";

const onDone = ({ sovThankyouStatus }: SovendusThankyouPageData) => {
  console.log("Sovendus thank you page done", { sovThankyouStatus });
};

const config: SovendusThankYouPageConfig = {
  settings: {
    // generate with sovendus-integration-settings-ui
  },
  integrationType: "custom-integration-1.0.0",
  iframeContainerId: "sovendus-integration-container",
  orderData: {
    // order values for Voucher Network accounting / Optimize
  },
  customerData: {
    // billing data for Voucher Network / Checkout Benefits / Optimize
  },
};

new SovendusThankyouPage().main(config, onDone);
```

- You can override these classes with your own implementations if needed.
- For a smaller payload, import from the minified export: `import { ... } from "sovendus-integration-scripts/minified"`.

## React usage (optional)

A React-compatible build is available:

```tsx
import { /* component(s) */ } from "sovendus-integration-scripts/react";
```

React is optional and supported from React 16.8 up to the latest 19.x.

## Generate settings

Use our UI to create the settings object you pass into the scripts:

- <https://github.com/Sovendus-GmbH/sovendus-integration-settings-ui>

## Directory structure

- src/scripts/vanilla – Landing and Thank You page scripts (default exports)
- src/scripts/react – React-specific entry points (optional)
- src/app – Next.js-based dev/preview server

## Development

- Build from source

```bash
yarn install
yarn build
```

- Developer preview (runs the Next.js preview server and watches sources)

```bash
yarn dev
```

- Lint and tests

```bash
yarn lint && yarn test
# or
yarn pub
```

## Publishing (maintainers)

```bash
yarn pub
```

## Related packages

- sovendus-integration-types – TypeScript types for the integration
  <https://github.com/Sovendus-GmbH/sovendus-integration-types>
- sovendus-integration-settings-ui – UI to generate settings
  <https://github.com/Sovendus-GmbH/sovendus-integration-settings-ui>
- sovendus-builder – Vite-based build wrapper
  <https://github.com/Sovendus-GmbH/sovendus-builder>
- sovendus-release-tool – Release, build, test and lint helper
  <https://github.com/Sovendus-GmbH/sovendus-release-tool>

## Contributing

1) Fork the repository
2) Create a feature/bugfix branch
3) Commit and push
4) Open a PR and ensure tests pass

## License

GPL-3.0-only

## Support

Issues: Get in touch with Sovendus integration support

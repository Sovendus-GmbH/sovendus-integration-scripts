# Sovendus React API - Generic React Components

This package provides Sovendus integration components that work with any React application, not just Shopify. The components use inline styles and standard React patterns.

## Installation

```bash
npm install sovendus-integration-scripts
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { 
  SovendusBanner, 
  type OrderData, 
  type CustomerData, 
  type LocalizationData, 
  type SovendusConfig 
} from 'sovendus-integration-scripts/react';

function ThankYouPage() {
  // Order data from your e-commerce system
  const orderData: OrderData = {
    orderConfirmationNumber: "ORDER-12345",
    currency: "EUR",
    grossAmount: 149.99,
    taxAmount: 23.99,
    shippingAmount: 5.99,
    voucherCodes: ["SAVE10", "FREESHIP"]
  };

  // Customer data (optional)
  const customerData: CustomerData = {
    email: "customer@example.com",
    phone: "+49123456789",
    firstName: "John",
    lastName: "Doe",
    address: {
      countryCode: "DE",
      city: "Berlin",
      zip: "10115",
      street: "Hauptstraße",
      streetNumber: "123"
    }
  };

  // Localization data
  const localization: LocalizationData = {
    language: "de",
    country: "DE"
  };

  // Sovendus configuration (get these from your Sovendus account)
  const config: SovendusConfig = {
    trafficSourceNumber: "12345",
    trafficMediumNumber: "67890",
    isEnabled: true
  };

  return (
    <div>
      <h1>Thank you for your order!</h1>
      
      <SovendusBanner
        orderData={orderData}
        customerData={customerData}
        localization={localization}
        config={config}
      />
    </div>
  );
}

export default ThankYouPage;
```

### Using Individual Components

You can also use the individual UI components for custom layouts:

```tsx
import React from 'react';
import { 
  BlockStack, 
  Button, 
  Heading, 
  Text, 
  Image,
  Link 
} from 'sovendus-integration-scripts/react';

function CustomBanner() {
  return (
    <BlockStack 
      padding="base" 
      spacing="base" 
      border="base" 
      borderRadius="base"
      background="base"
    >
      <Heading level={2}>Special Offers</Heading>
      
      <Text>Check out these exclusive deals!</Text>
      
      <Image 
        source="https://example.com/banner.jpg" 
        alt="Special offer"
      />
      
      <Link to="https://example.com/offers" external>
        <Button>View Offers</Button>
      </Link>
    </BlockStack>
  );
}
```

## Component Props

### SovendusBanner

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `orderData` | `OrderData` | Yes | Order information including confirmation number, amounts, currency |
| `customerData` | `CustomerData` | No | Customer information like email, phone, address |
| `localization` | `LocalizationData` | Yes | Language and country settings |
| `config` | `SovendusConfig` | Yes | Sovendus account configuration |

### OrderData

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `orderConfirmationNumber` | `string` | Yes | Unique order identifier |
| `currency` | `string` | Yes | Currency code (e.g., "EUR", "USD") |
| `grossAmount` | `number` | Yes | Total order amount including tax and shipping |
| `taxAmount` | `number` | Yes | Tax amount |
| `shippingAmount` | `number` | Yes | Shipping cost |
| `voucherCodes` | `string[]` | No | Applied voucher/coupon codes |

### CustomerData

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `email` | `string` | No | Customer email address |
| `phone` | `string` | No | Customer phone number |
| `firstName` | `string` | No | Customer first name |
| `lastName` | `string` | No | Customer last name |
| `address` | `Address` | No | Customer address information |

### SovendusConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `trafficSourceNumber` | `string` | Yes | Your Sovendus traffic source number |
| `trafficMediumNumber` | `string` | Yes | Your Sovendus traffic medium number |
| `isEnabled` | `boolean` | No | Whether the banner should be shown (default: true) |

## Migration from Shopify

If you're migrating from the Shopify version, the main changes are:

1. **No more hooks**: Instead of using Shopify hooks like `useApi()`, `useCurrency()`, etc., you pass data as props
2. **Generic components**: UI components use inline styles instead of Shopify's design system
3. **Explicit configuration**: You need to provide Sovendus configuration explicitly

### Before (Shopify)

```tsx
function ThankYouBanner() {
  // Data was automatically fetched from Shopify
  return <SovendusBanner />;
}
```

### After (Generic React)

```tsx
function ThankYouBanner() {
  // You provide the data explicitly
  return (
    <SovendusBanner
      orderData={orderData}
      customerData={customerData}
      localization={localization}
      config={config}
    />
  );
}
```

## Styling

All components use inline styles and can be customized by passing a `style` prop to most components. The default styling follows modern web design principles with clean, accessible layouts.

## Browser Support

Compatible with React 16.8+ and all modern browsers that support ES2018.

"use client";

import { CheckCircle, Package, Truck } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import {
  getSettings,
  initialSettings,
} from "sovendus-integration-settings-ui/demo-style-less";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "sovendus-integration-settings-ui/ui";
import type { SovendusAppSettings } from "sovendus-integration-types";
import { CountryCodes, LanguageCodes } from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

// Import the new generic React API
import {
  type CustomerData,
  type LocalizationData,
  type OrderData,
  SovendusBanner,
  type SovendusConfig,
} from "../../../../scripts/react-api";
import { AdminBar } from "../components/admin-bar";
import Footer from "../components/footer";
import Header from "../components/header";
import { SovendusThankyouPageApiDemoForm } from "./demo-form";

const defaultConfig: {
  orderData: SovendusConversionsData;
  customerData: SovendusConsumerData;
} = {
  orderData: {
    sessionId: "demo-session-123",
    orderId: "13245",
    orderValue: {
      grossOrderValue: 1324,
      shippingValue: 12,
      taxPercent: 20,
    },
    orderCurrency: "EUR",
    usedCouponCode: "1324",
    usedCouponCodes: ["1324", "SAVE10", "FREE_SHIP"],
  },
  customerData: {
    consumerSalutation: "Mr.",
    consumerFirstName: "John",
    consumerLastName: "Doe",
    consumerEmail: "John.doe@bla.bla",
    consumerCountry: CountryCodes.DE,
    consumerZipcode: "84359",
    consumerPhone: "0123456789",
    consumerYearOfBirth: "1991",
    consumerDateOfBirth: "01.01.1991",
    consumerStreetWithNumber: "1 test street",
    consumerCity: "testCity",
  },
};

// Helper function to convert old format to new API format
function convertToNewApiFormat(
  oldOrderData: SovendusConversionsData,
  oldCustomerData: SovendusConsumerData,
  settings: SovendusAppSettings,
): {
  orderData: OrderData;
  customerData: CustomerData;
  localization: LocalizationData;
  config: SovendusConfig;
} {
  // Calculate amounts
  const grossAmount = Number(oldOrderData.orderValue?.grossOrderValue) || 0;
  const shippingAmount = Number(oldOrderData.orderValue?.shippingValue) || 0;
  const taxAmount =
    Number(oldOrderData.orderValue?.taxValue) ||
    (grossAmount * (Number(oldOrderData.orderValue?.taxPercent) || 0)) / 100;

  return {
    orderData: {
      orderConfirmationNumber: oldOrderData.orderId || "ORDER-12345",
      currency: oldOrderData.orderCurrency || "EUR",
      grossAmount,
      taxAmount,
      shippingAmount,
      voucherCodes:
        oldOrderData.usedCouponCodes ||
        (oldOrderData.usedCouponCode ? [oldOrderData.usedCouponCode] : []),
    },
    customerData: {
      email: oldCustomerData.consumerEmail || undefined,
      phone: oldCustomerData.consumerPhone || undefined,
      firstName: oldCustomerData.consumerFirstName || undefined,
      lastName: oldCustomerData.consumerLastName || undefined,
      address: {
        countryCode: oldCustomerData.consumerCountry || "DE",
        city: oldCustomerData.consumerCity || "",
        zip: oldCustomerData.consumerZipcode || "",
        street: oldCustomerData.consumerStreetWithNumber || "",
      },
    },
    localization: {
      language: "de", // Default to German, could be derived from country
      country: oldCustomerData.consumerCountry || "DE",
    },
    config: {
      trafficSourceNumber:
        settings.voucherNetwork?.countries?.ids?.[CountryCodes.DE]?.languages?.[
          LanguageCodes.DE
        ]?.trafficSourceNumber,
      trafficMediumNumber:
        settings.voucherNetwork?.countries?.ids?.[CountryCodes.DE]?.languages?.[
          LanguageCodes.DE
        ]?.trafficMediumNumber,
      isEnabled: true,
    },
  };
}

export default function SovendusThankYouPageApiDemo(): JSX.Element {
  const [settings] = useState<SovendusAppSettings>(() => {
    if (typeof window !== "undefined") {
      const settings = localStorage.getItem("sovendus-settings");
      if (settings) {
        return JSON.parse(settings) as SovendusAppSettings;
      }
      return getSettings();
    }
    return initialSettings;
  });

  const [config, setConfig] = useState<{
    orderData: SovendusConversionsData;
    customerData: SovendusConsumerData;
  }>(
    (): {
      orderData: SovendusConversionsData;
      customerData: SovendusConsumerData;
    } => {
      if (typeof window !== "undefined") {
        const storedConfig = localStorage.getItem("thankyouApiConfig");
        return storedConfig
          ? (JSON.parse(storedConfig) as {
              orderData: SovendusConversionsData;
              customerData: SovendusConsumerData;
            })
          : defaultConfig;
      }
      return defaultConfig;
    },
  );

  useEffect(() => {
    localStorage.setItem("thankyouApiConfig", JSON.stringify(config));
  }, [config]);

  // Convert to new API format
  const {
    orderData,
    customerData,
    localization,
    config: sovendusConfig,
  } = convertToNewApiFormat(config.orderData, config.customerData, settings);
  return (
    <div className="flex flex-col min-h-screen">
      <AdminBar
        pageName="Order Success Page (New React API)"
        configContent={(setConfigOpen) => (
          <SovendusThankyouPageApiDemoForm
            config={config}
            setConfig={setConfig}
            setConfigOpen={setConfigOpen}
          />
        )}
      />
      <Header />
      <main className="flex-1 m-auto container px-4 py-8 md:px-6 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been received and is
              being processed.
            </p>
            <p className="font-medium">
              Order Number:{" "}
              <span className="font-bold">{orderDetails.orderNumber}</span>
            </p>
          </div>

          {/* New Generic React API Banner */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              🎉 New Generic React API Demo
            </h3>
            <p className="text-sm text-blue-600 mb-4">
              This banner uses the new generic React API that works with any
              React application, not just Shopify. It uses inline styles and
              accepts data as props.
            </p>
            <SovendusBanner
              orderData={orderData}
              customerData={customerData}
              localization={localization}
              config={sovendusConfig}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Placed on {orderDetails.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">{item.price}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>$149.97</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold">
                    <span>Total</span>
                    <span>{orderDetails.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Shipping Address:</p>
                  <p className="text-muted-foreground">
                    {orderDetails.shippingAddress}
                  </p>
                  <div className="mt-4">
                    <p className="font-medium">Shipping Method:</p>
                    <p className="text-muted-foreground">
                      {orderDetails.shippingMethod}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <p className="font-medium">Order Confirmed</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-5">
                      April 8, 2025 at 6:24 PM
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      <p className="text-muted-foreground">Processing</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      <p className="text-muted-foreground">Shipped</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
                      <p className="text-muted-foreground">Delivered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/site/subscriptions">View My Subscriptions</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Mock order details
const orderDetails = {
  orderNumber: "ORD-12345-6789",
  date: "April 8, 2025",
  total: "$149.97",
  items: [
    {
      id: 1,
      name: "Premium T-Shirt",
      price: "$29.99",
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Classic Jeans",
      price: "$59.99",
      quantity: 2,
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
  shippingMethod: "Standard Shipping (3-5 business days)",
  paymentMethod: "Visa ending in 4242",
};

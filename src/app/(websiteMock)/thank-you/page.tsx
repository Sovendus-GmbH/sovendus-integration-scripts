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
import { CountryCodes } from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

import { SovendusThankyouPageReact } from "../../../scripts/react";
import { loggerInfo } from "../../../scripts/vanilla";
import AdminBar from "../components/admin-bar";
import Footer from "../components/footer";
import Header from "../components/header";
import { SovendusThankyouPageDemoForm } from "./demo-form";

const defaultConfig: {
  orderData: SovendusConversionsData;
  customerData: SovendusConsumerData;
} = {
  orderData: {
    sessionId: "asdas",
    orderId: "13245",
    orderValue: {
      // netOrderValue: 1100,
      grossOrderValue: 1324,
      shippingValue: 12,
      taxPercent: 20,
      // taxValue: 15,
    },
    orderCurrency: "EUR",
    usedCouponCode: "1324",
    // usedCouponCodes: ["1324", "4321", "5421", "8461", "1296"],
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

export default function SovendusThankYouPageDemo(): JSX.Element {
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
        const storedConfig = localStorage.getItem("thankyouConfig");
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
    localStorage.setItem("thankyouConfig", JSON.stringify(config));
  }, [config]);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminBar
        pageName="Order Success Page"
        configContent={(setConfigOpen) => (
          <SovendusThankyouPageDemoForm
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
          <SovendusThankyouPageReact
            integrationType={"sovendus-integration-scripts-preview"}
            sovDebugLevel={"debug"}
            orderData={config.orderData}
            customerData={config.customerData}
            settings={settings}
            onDone={(sovThankyouStatus, sovThankyouConfig) => {
              loggerInfo(
                "Sovendus Thankyou Page done",
                "ThankyouPage",
                "sovThankyouStatus",
                sovThankyouStatus,
                "sovThankyouConfig",
                sovThankyouConfig,
              );
            }}
          />
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
              <Link href="/subscriptions">View My Subscriptions</Link>
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

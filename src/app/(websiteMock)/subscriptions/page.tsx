"use client";

import { ExternalLink, Gift } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "sovendus-integration-settings-ui/ui";
import { CountryCodes, LanguageCodes } from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

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
      grossOrderValue: 1324,
      shippingValue: 12,
      taxPercent: 20,
    },
    orderCurrency: "EUR",
    usedCouponCode: "1234",
    usedCouponCodes: ["5678", "91011", "121314"],
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
    consumerEmailHash: "",
    consumerLanguage: LanguageCodes.DE,
    consumerStreet: "",
    consumerStreetNumber: "",
  },
};

export default function SovendusRewardsPageDemo(): JSX.Element {
  const [config, setConfig] = useState<{
    orderData: SovendusConversionsData;
    customerData: SovendusConsumerData;
  }>(
    (): {
      orderData: SovendusConversionsData;
      customerData: SovendusConsumerData;
    } => {
      if (typeof window !== "undefined") {
        const storedConfig = localStorage.getItem("rewardsConfig");
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
        pageName="Subscriptions Page"
        configContent={(setConfigOpen) => (
          <SovendusThankyouPageDemoForm
            config={config}
            setConfig={setConfig}
            setConfigOpen={setConfigOpen}
          />
        )}
      />
      <Header />
      <main className="flex-1 container m-auto px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Subscriptions
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your active subscriptions and payment methods
            </p>
          </div>

          {/* Sovendus Rewards Banner */}
          <Card className="overflow-hidden bg-gradient-to-r from-rose-100 to-teal-100 border-none">
            <div>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                  <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm p-4 rounded-full">
                    <Gift className="h-12 w-12 text-rose-500" />
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold">
                      Exclusive Member Rewards
                    </h3>
                    <p className="text-sm md:text-base">
                      Thanks for being a valued Test Shop member! Unlock special
                      vouchers from top brands through our partnership with
                      Sovendus.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="bg-white/70">
                        Nike
                      </Badge>
                      <Badge variant="secondary" className="bg-white/70">
                        Adidas
                      </Badge>
                      <Badge variant="secondary" className="bg-white/70">
                        H&M
                      </Badge>
                      <Badge variant="secondary" className="bg-white/70">
                        Zara
                      </Badge>
                      <Badge variant="secondary" className="bg-white/70">
                        +50 more
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 pt-4 md:mt-0 md:ml-auto">
                  <Button asChild size="lg" className="group">
                    <Link href="#">
                      Claim Your Vouchers
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
          {/* 
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
          /> */}
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                You have{" "}
                {subscriptions.filter((s) => s.status === "Active").length}{" "}
                active subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        {subscription.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="m-3"
                          variant={
                            subscription.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{subscription.price}</TableCell>
                      <TableCell>{subscription.nextBilling}</TableCell>
                      <TableCell>{subscription.startDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          {subscription.status === "Active"
                            ? "Manage"
                            : "Resume"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Billing History</Button>
              <Button>Add New Subscription</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs font-medium">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 04/2028
                      </p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs font-medium">MC</span>
                    </div>
                    <div>
                      <p className="font-medium">Mastercard ending in 8888</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 09/2026
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Set as default
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const subscriptions = [
  {
    id: 1,
    name: "Premium Membership",
    status: "Active",
    price: "$9.99/month",
    nextBilling: "May 15, 2025",
    startDate: "April 15, 2025",
  },
  {
    id: 2,
    name: "Fashion Box",
    status: "Active",
    price: "$49.99/month",
    nextBilling: "May 20, 2025",
    startDate: "April 20, 2025",
  },
  {
    id: 3,
    name: "Accessories Bundle",
    status: "Paused",
    price: "$29.99/month",
    nextBilling: "Paused",
    startDate: "March 10, 2025",
  },
];

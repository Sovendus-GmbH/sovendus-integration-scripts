"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import {
  getSettings,
  initialSettings,
} from "sovendus-integration-settings-ui/demo-style-less";
import type { SovendusAppSettings } from "sovendus-integration-types";
import { CountryCodes } from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

import { SovendusThankyouPageReact } from "../../scripts/react/thankyou";
import { loggerInfo } from "../../scripts/vanilla";
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
    usedCouponCode: "1324",
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

export default function (): JSX.Element {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Subscription Dashboard</h1>
          <p className="opacity-80">Manage your subscription and rewards</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Subscription Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Subscription Status
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium">Premium Plus</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Billing</p>
              <p className="font-medium">July 15, 2023</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Cost</p>
              <p className="font-medium">€24.99</p>
            </div>
          </div>
        </div>

        {/* Demo Form (kept as requested) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Subscription Settings
          </h2>
          <SovendusThankyouPageDemoForm config={config} setConfig={setConfig} />
        </div>

        {/* Sovendus React Component (stays as is) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Integration Preview
          </h2>
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
        </div>

        {/* Rewards Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold mb-2">
                Subscription Rewards Await!
              </h2>
              <p className="text-purple-100 mb-4">
                Thanks to your subscription, you now have exclusive access to
                premium vouchers from our partners.
              </p>
              <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-md font-medium transition duration-200">
                Explore Your Rewards
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition"
                >
                  <div className="w-16 h-16 rounded-md bg-white/30 mb-2 flex items-center justify-center">
                    <span className="text-xl font-bold">-{10 + i * 5}%</span>
                  </div>
                  <p className="text-sm font-medium">Partner {i}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

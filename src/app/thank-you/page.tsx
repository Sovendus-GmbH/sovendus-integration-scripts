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
      // netOrderValue: 1100,
      grossOrderValue: 1324,
      shippingValue: 12,
      taxPercent: 20,
      // taxValue: 15,
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
    <div>
      <h1>This is a thank you page</h1>
      <SovendusThankyouPageDemoForm config={config} setConfig={setConfig} />
      <h2>Here should be the inline integration</h2>
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
  );
}

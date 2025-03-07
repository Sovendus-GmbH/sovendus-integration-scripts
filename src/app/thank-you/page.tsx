"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { CountryCodes } from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

import { SovendusThankyouPageDemoForm } from "./demo-form";
import { SovendusThankyouPageDemoScript } from "./script";

const defaultConfig: {
  orderData: SovendusConversionsData;
  customerData: SovendusConsumerData;
} = {
  orderData: {
    sessionId: "asdas",
    orderId: "13245",
    orderValue: "1324",
    orderCurrency: "EUR",
    usedCouponCode: "1324",
  },
  customerData: {
    consumerSalutation: "Mr.",
    consumerFirstName: "John",
    consumerLastName: "Doe",
    consumerEmail: "John.doe@bla.bla",
    consumerCountry: CountryCodes.DE,
    consumerZipcode: "",
    consumerPhone: "0123456789",
    consumerYearOfBirth: "1991",
    consumerDateOfBirth: "01.01.1991",
    consumerStreet: "test street",
    consumerStreetNumber: "1",
    consumerCity: "testCity",
  },
};

export default function SovendusThankYouPageDemo(): JSX.Element {
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
  const containerId = "sovendus-thankyou-container";
  return (
    <div>
      <h1>This is a thank you page</h1>
      <SovendusThankyouPageDemoForm config={config} setConfig={setConfig} />
      <SovendusThankyouPageDemoScript
        config={config}
        containerId={containerId}
      />
      <h2>Here should be the inline integration</h2>
      <div id={containerId} />
    </div>
  );
}

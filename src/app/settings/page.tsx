"use client";

import type { JSX } from "react";
import { SettingsUIDemo } from "sovendus-integration-settings-ui/demo";
import type { SovendusAppSettings } from "sovendus-integration-types";

export const initialSettings: SovendusAppSettings = {
  settings:
    '{"checkoutProducts":true,"version":"3","voucherNetwork":{"cookieTracking":true,"settingType":"country","countries":{"ids":{"DE":{"languages":{"DE":{"iframeContainerQuerySelector":"","trafficMediumNumber":"2","trafficSourceNumber":"4704","isEnabled":true}}}}}},"optimize":{"settingsType":"simple","simple":{"isEnabled":true,"optimizeId":"vdf"}},"employeeBenefits":{"isEnabled":false,"showWidgetOnDashboard":false,"addToSidebar":false}}',
  iframeContainerId: "sovendus-integration-container",
  integrationType: "woocommerce-2.1.0",
  orderData: {
    sessionId: "",
    orderId: "28",
    orderValue: 50,
    orderCurrency: "EUR",
    usedCouponCodes: [],
  },
  customerData: {
    consumerFirstName: "Marcus",
    consumerLastName: "Brandstaetter",
    consumerEmail: "marcus.brandstaetter@sovendus.com",
    consumerStreetNumber: "12",
    consumerStreet: "Bahnhofstraße",
    consumerZipcode: "76137",
    consumerCity: "Karlsruhe",
    consumerCountry: "DE",
    consumerLanguage: null,
    consumerPhone: "0154654654656",
  },
};

export default function SettingsPage(): JSX.Element {
  return <SettingsUIDemo initialSettings={initialSettings} />;
}

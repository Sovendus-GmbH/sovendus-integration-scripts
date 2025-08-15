import type { SovendusThankYouPageConfig } from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { parseStreet } from "./parse-street";

describe("parseStreet", () => {
  it("should parse street with number", () => {
    const mockThis = {
      splitStreetAndStreetNumber: vi
        .fn()
        .mockReturnValue(["Main Street", "123"]),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: {
        consumerStreetWithNumber: "123 Main Street",
        consumerStreet: undefined,
        consumerStreetNumber: undefined,
      },
    } as SovendusThankYouPageConfig;

    parseStreet.call(mockThis, mockConfig);

    expect(mockThis.splitStreetAndStreetNumber).toHaveBeenCalledWith(
      "123 Main Street",
    );
    expect(mockConfig.customerData.consumerStreet).toBe("Main Street");
    expect(mockConfig.customerData.consumerStreetNumber).toBe("123");
  });

  it("should not parse if no street with number", () => {
    const mockThis = {
      splitStreetAndStreetNumber: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      customerData: {
        consumerStreetWithNumber: undefined,
        consumerStreet: "Existing Street",
        consumerStreetNumber: "456",
      },
    } as SovendusThankYouPageConfig;

    parseStreet.call(mockThis, mockConfig);

    expect(mockThis.splitStreetAndStreetNumber).not.toHaveBeenCalled();
    expect(mockConfig.customerData.consumerStreet).toBe("Existing Street");
    expect(mockConfig.customerData.consumerStreetNumber).toBe("456");
  });
});

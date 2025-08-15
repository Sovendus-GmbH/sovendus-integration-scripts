import type {
  IntegrationData,
  SovendusThankYouPageConfig,
} from "sovendus-integration-types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { handleCheckoutProductsConversion } from "./handle-checkout-products-conversion";

// Mock fetch globally
global.fetch = vi.fn();

describe("handleCheckoutProductsConversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false if checkout products not enabled", async () => {
    const mockThis = {
      getCookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: { checkoutProducts: false },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { checkoutProductsPixelFired: false },
    } as IntegrationData;

    const result = await handleCheckoutProductsConversion.call(
      mockThis,
      mockConfig,
      mockStatus,
    );

    expect(result).toBe(false);
    expect(mockThis.getCookie).not.toHaveBeenCalled();
    expect(mockStatus.status.checkoutProductsPixelFired).toBe(false);
  });

  it("should fire pixel if checkout products enabled and token exists", async () => {
    const mockThis = {
      getCookie: vi.fn().mockResolvedValue("test-token"),
      clearCookie: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: { checkoutProducts: true },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { checkoutProductsPixelFired: false },
    } as IntegrationData;

    vi.mocked(fetch).mockResolvedValue(new Response());

    const result = await handleCheckoutProductsConversion.call(
      mockThis,
      mockConfig,
      mockStatus,
    );

    expect(result).toBe(false);
    expect(mockThis.getCookie).toHaveBeenCalledWith("sovReqToken");
    expect(mockThis.clearCookie).toHaveBeenCalledWith("sovReqToken");
    expect(fetch).toHaveBeenCalledWith(
      "https://press-order-api.sovendus.com/ext/image?sovReqToken=test-token",
    );
    expect(mockStatus.status.checkoutProductsPixelFired).toBe(true);
  });

  it("should not fire pixel if no token", async () => {
    const mockThis = {
      getCookie: vi.fn().mockResolvedValue(undefined),
      clearCookie: vi.fn(),
    } as unknown as SovendusThankyouPage;

    const mockConfig = {
      settings: { checkoutProducts: true },
    } as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { checkoutProductsPixelFired: false },
    } as IntegrationData;

    const result = await handleCheckoutProductsConversion.call(
      mockThis,
      mockConfig,
      mockStatus,
    );

    expect(result).toBe(false);
    expect(mockThis.clearCookie).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(mockStatus.status.checkoutProductsPixelFired).toBe(false);
  });
});

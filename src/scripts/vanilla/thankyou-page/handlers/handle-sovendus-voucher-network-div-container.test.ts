import type {
  IntegrationData,
  SovendusThankYouPageConfig,
  VoucherNetworkLanguage,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusThankyouPage } from "../thankyou-page-handler";
import { handleSovendusVoucherNetworkDivContainer } from "./handle-sovendus-voucher-network-div-container";

// Mock the shared-utils module
vi.mock("../../shared-utils", () => ({
  throwErrorInNonBrowserContext: vi.fn(),
  loggerError: vi.fn(),
}));

describe("handleSovendusVoucherNetworkDivContainer", () => {
  it("should return existing container id when where is none", () => {
    const mockElement = {
      id: "existing-container",
      insertAdjacentElement: vi.fn(() => {}),
    };

    Object.defineProperty(document, "querySelector", {
      value: vi.fn().mockReturnValue(mockElement),
      writable: true,
    });

    const mockThis = {
      getIframeQuerySelector: vi.fn().mockReturnValue({
        selector: "#existing-container",
        where: "none",
      }),
    } as unknown as SovendusThankyouPage;

    const mockVoucherConfig = {} as VoucherNetworkLanguage;
    const mockConfig = {} as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { voucherNetworkIframeContainerFound: false },
    } as IntegrationData;

    const result = handleSovendusVoucherNetworkDivContainer.call(
      mockThis,
      mockVoucherConfig,
      mockConfig,
      mockStatus,
    );

    expect(result).toBe("existing-container");
    expect(mockElement.insertAdjacentElement).not.toHaveBeenCalled();
  });

  it("should create new container when where is not none", () => {
    const mockElement = {
      id: "root-container",
      insertAdjacentElement: vi.fn(),
    };

    const mockNewDiv = {
      id: "",
    };

    Object.defineProperty(document, "querySelector", {
      value: vi.fn().mockReturnValue(mockElement),
      writable: true,
    });

    const mockCreateElement = vi.fn().mockReturnValue(mockNewDiv);
    Object.defineProperty(document, "createElement", {
      value: mockCreateElement,
      writable: true,
    });

    const mockThis = {
      getIframeQuerySelector: vi.fn().mockReturnValue({
        selector: "#root-container",
        where: "afterend",
      }),
    } as unknown as SovendusThankyouPage;

    const mockVoucherConfig = {} as VoucherNetworkLanguage;
    const mockConfig = {} as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { voucherNetworkIframeContainerFound: false },
    } as IntegrationData;

    const result = handleSovendusVoucherNetworkDivContainer.call(
      mockThis,
      mockVoucherConfig,
      mockConfig,
      mockStatus,
    );

    expect(mockCreateElement).toHaveBeenCalledWith("div");
    expect(mockNewDiv.id).toBe("sovendus-container");
    expect(mockElement.insertAdjacentElement).toHaveBeenCalledWith(
      "afterend",
      mockNewDiv,
    );
    expect(result).toBe("sovendus-container");
    expect(mockStatus.status.voucherNetworkIframeContainerFound).toBe(true);
  });

  it("should return empty string when container not found", () => {
    Object.defineProperty(document, "querySelector", {
      value: vi.fn().mockReturnValue(null),
      writable: true,
    });

    const mockThis = {
      getIframeQuerySelector: vi.fn().mockReturnValue({
        selector: "#non-existent",
        where: "afterend",
      }),
    } as unknown as SovendusThankyouPage;

    const mockVoucherConfig = {} as VoucherNetworkLanguage;
    const mockConfig = {} as SovendusThankYouPageConfig;
    const mockStatus = {
      status: { voucherNetworkIframeContainerFound: true },
    } as IntegrationData;

    const result = handleSovendusVoucherNetworkDivContainer.call(
      mockThis,
      mockVoucherConfig,
      mockConfig,
      mockStatus,
    );

    expect(result).toBe("");
    expect(mockStatus.status.voucherNetworkIframeContainerFound).toBe(false);
  });
});

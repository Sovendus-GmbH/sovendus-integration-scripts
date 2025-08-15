import type {
  SovendusPageConfig,
  SovPageStatus,
} from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusPage } from "../sovendus-page-handler";
import { sovendusOptimize } from "./sovendus-optimize";

// Mock shared utils
vi.mock("../../shared-utils", () => ({
  getOptimizeId: vi.fn(),
}));
import { getOptimizeId } from "../../shared-utils";

describe("sovendusOptimize", () => {
  it("should return early if no optimize ID", () => {
    vi.mocked(getOptimizeId).mockReturnValue(undefined);

    const mockThis = {
      handleOptimizeScript: vi.fn(),
    } as unknown as SovendusPage;

    const mockConfig = { settings: {} } as unknown as SovendusPageConfig;
    const mockStatus = {
      status: { loadedOptimize: false },
    } as unknown as SovPageStatus;

    sovendusOptimize.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.handleOptimizeScript).not.toHaveBeenCalled();
    expect(mockStatus.status.loadedOptimize).toBe(false);
  });

  it("should call handleOptimizeScript with optimize ID", () => {
    vi.mocked(getOptimizeId).mockReturnValue("test-optimize-id");

    const mockThis = {
      handleOptimizeScript: vi.fn(),
    } as unknown as SovendusPage;

    const mockConfig = {
      settings: {},
      country: "DE",
    } as unknown as SovendusPageConfig;
    const mockStatus = {
      status: { loadedOptimize: false },
    } as unknown as SovPageStatus;

    sovendusOptimize.call(mockThis, mockConfig, mockStatus);

    expect(mockThis.handleOptimizeScript).toHaveBeenCalledWith(
      "test-optimize-id",
      mockConfig,
      mockStatus,
    );
    expect(mockStatus.status.loadedOptimize).toBe(true);
  });
});

import type { SovendusPageConfig } from "sovendus-integration-types";
import { describe, expect, it, vi } from "vitest";

import type { SovendusPage } from "../sovendus-page-handler";
import { sovendusPageMain } from "./sovendus-page-main";

describe("sovendusPageMain", () => {
  it("should handle undefined config", async () => {
    const mockThis = {
      initializeStatus: vi.fn().mockReturnValue({
        status: { sovPageConfigFound: false },
        times: {},
      }),
      processConfig: vi.fn(),
      lookForUrlParamsToStore: vi.fn(),
      sovendusOptimize: vi.fn(),
      getPerformanceTime: vi.fn().mockReturnValue(123),
    } as unknown as SovendusPage;

    const onDone = vi.fn();

    await sovendusPageMain.call(
      mockThis,
      undefined as unknown as SovendusPageConfig,
      onDone,
    );

    expect(mockThis.initializeStatus).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledWith({
      sovPageStatus: expect.objectContaining({
        status: { sovPageConfigFound: false },
      }),
      sovPageConfig: undefined,
    });
  });

  it("should process valid config", async () => {
    const mockThis = {
      initializeStatus: vi.fn().mockReturnValue({
        status: { sovPageConfigFound: true },
        times: {},
      }),
      processConfig: vi.fn(),
      lookForUrlParamsToStore: vi.fn().mockResolvedValue({}),
      sovendusOptimize: vi.fn(),
      getPerformanceTime: vi.fn().mockReturnValue(123),
    } as unknown as SovendusPage;

    const mockConfig = {
      settings: {},
    } as unknown as SovendusPageConfig;
    const onDone = vi.fn();

    await sovendusPageMain.call(mockThis, mockConfig, onDone);

    expect(mockThis.processConfig).toHaveBeenCalledWith(
      mockConfig,
      expect.any(Object),
    );
    expect(mockThis.lookForUrlParamsToStore).toHaveBeenCalled();
    expect(mockThis.sovendusOptimize).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
});

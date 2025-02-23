import type { ReleaseConfig } from "./release-tool/types";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      release: false,
      updateDeps: true,
      version: "1.0.0",
    },

    {
      directory: "integration-types",
      updateDeps: true,
      release: true,
      releaseOptions: {
        tagPrefix: "types_",
        foldersToScanAndBumpThisPackage: [
          { folder: "integration-settings-ui" },
          { folder: "integration-scripts" },
        ],
      },
      version: "3.3.17",
    },
    {
      directory: "integration-settings-ui",
      updateDeps: true,
      release: true,
      releaseOptions: {
        tagPrefix: "settings_ui_",
        foldersToScanAndBumpThisPackage: [],
      },
      version: "3.4.2",
    },
    {
      directory: "integration-scripts",
      updateDeps: true,
      release: true,
      releaseOptions: {
        tagPrefix: "scripts_",
        foldersToScanAndBumpThisPackage: [],
      },
      version: "3.3.21",
    },
  ],
};
export default releaseConfig;

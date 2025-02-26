import type { ReleaseConfig } from "sovendus-release-tool/types";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      version: "3.3.27",
      release: true,
      releaseOptions: {
        // foldersToScanAndBumpThisPackage: [
        //   // scan whole dev env
        //   { folder: "../../../../" },
        // ],
      },
    },
  ],
};
export default releaseConfig;

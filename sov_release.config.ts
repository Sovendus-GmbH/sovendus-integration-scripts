import type { ReleaseConfig } from "sovendus-release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      version: "3.4.5",
      release: true,
      lintAndBuild: true,
      test: true,
      versionBumper: {
        jsVars: [
          {
            filePath: "src/scripts/constants.ts",
            varName: "integrationScriptVersion",
          },
        ],
      },
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

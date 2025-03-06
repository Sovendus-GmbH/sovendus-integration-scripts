import type { ReleaseConfig } from "sovendus-release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      version: "3.4.0",
      release: true,
      lintAndBuild: true,
      test: true,
      versionBumper: {
        jsVars: [
          {
            filePath: "wordpress-plugin/wc-sovendus.php",
            varName: "SOVENDUS_VERSION",
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

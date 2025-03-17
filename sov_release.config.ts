import type { ReleaseConfig } from "sovendus-release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      lint: true,
      build: true,
      test: true,
      release: {
        version: "3.5.5",
        versionBumper: [
          {
            filePath: "src/scripts/constants.ts",
            varName: "integrationScriptVersion",
          },
        ],
      },
    },
  ],
};
export default releaseConfig;

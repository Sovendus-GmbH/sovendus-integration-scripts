import type { BuildConfig } from "sovendus-builder";

const buildConfig: BuildConfig = {
  foldersToClean: ["dist"],
  filesToCompile: [
    {
      input: "src/scripts/vanilla/index.ts",
      output: "dist/scripts/vanilla/index",
      options: {
        type: "vanilla",
        packageConfig: {
          isPackage: true,
          dtsEntryRoot: "src/scripts/vanilla",
          dtsInclude: ["src/scripts/vanilla/**/*"],
        },
      },
    },
    {
      input: "src/scripts/react/index.ts",
      output: "dist/scripts/react/index",
      options: {
        type: "react",
        packageConfig: {
          isPackage: true,
          dtsEntryRoot: "src/scripts/react",
          dtsInclude: ["src/scripts/react/**/*"],
        },
      },
    },
    {
      input: "src/app/index.ts",
      output: "dist/demo/index",
      options: {
        type: "react-tailwind",
        packageConfig: {
          isPackage: true,
          dtsEntryRoot: "src/app",
          dtsInclude: ["src/app/**/*"],
        },
      },
    },
  ],
};

export default buildConfig;

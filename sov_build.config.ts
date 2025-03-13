import type { BuildConfig } from "sovendus-builder";

const buildConfig: BuildConfig = {
  foldersToClean: ["dist"],
  filesToCompile: [
    {
      input: "src/scripts/index.ts",
      output: "dist/index",
      options: {
        type: "vanilla",
        packageConfig: {
          isPackage: true,
          dtsEntryRoot: "src/scripts",
          dtsInclude: ["src/scripts/**/*"],
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

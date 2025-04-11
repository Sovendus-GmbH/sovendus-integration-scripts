import type { BuildConfig } from "sovendus-builder";

const buildConfig: BuildConfig = {
  foldersToClean: ["dist"],
  filesToCompile: [
    {
      sovOptions: {
        input: "src/scripts/vanilla/index.ts",
        output: "dist/scripts/vanilla/index",
        type: "vanilla",
        packageConfig: {
          isPackage: true,
          dtsEntryRoot: "src/scripts/vanilla",
          dtsInclude: ["src/scripts/vanilla/**/*"],
        },
      },
    },
    {
      sovOptions: {
        input: "src/scripts/react/index.ts",
        output: "dist/scripts/react/index",
        type: "react",
        packageConfig: {
          isPackage: true,
          dtsEntryRoot: "src/scripts/react",
          dtsInclude: ["src/scripts/react/**/*"],
        },
      },
    },
    {
      sovOptions: {
        input: "src/app/index.ts",
        output: "dist/demo/index",
        type: "react-tailwind",
        packageConfig: {
          isPackage: true,
          dtsEntryRoot: "src/app",
          dtsInclude: ["src/app/**/*"],
        },
      },
    },
  ],
  filesOrFoldersToCopy: [
    {
      input: ".next",
      output: "dist/demo-dist/",
    },
  ],
};

export default buildConfig;

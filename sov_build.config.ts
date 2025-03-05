import type { BuildConfig } from "sovendus-builder";

const buildConfig: BuildConfig = {
  foldersToClean: ["dist"],
  filesToCompile: [
    {
      input: "src/index.ts",
      output: "dist/index",
      options: {
        type: "vanilla",
        isPackage: true,
      },
    },
    {
      input: "src/app/index.ts",
      output: "dist/demo-index",
      options: {
        type: "react-tailwind",
        isPackage: true,
      },
    },
  ],
};

export default buildConfig;

import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postCSS from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      dir: "./lib/cjs",
      format: "cjs",
    },
    {
      dir: "./lib/esm",
      format: "es",
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      typescript: require("typescript"),
    }),
    json(),
    image(),
    postCSS({
      plugins: [require("autoprefixer")],
    }),
  ],
};

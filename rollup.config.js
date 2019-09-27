import livereload from "rollup-plugin-livereload";
import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "bundle.js",
    format: "esm"
  },
  plugins: [typescript(), resolve(), serve(), livereload()]
};

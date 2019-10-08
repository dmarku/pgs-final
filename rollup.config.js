import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";

const config = {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "esm"
  },
  plugins: [typescript(), resolve()]
};

export default async args => {
  if (!args.watch) {
    return config;
  }

  const [livereload, serve] = await Promise.all([
    import("rollup-plugin-livereload"),
    import("rollup-plugin-serve")
  ]);

  return {
    ...config,
    plugins: [...config.plugins, livereload.default(), serve.default()]
  };
};

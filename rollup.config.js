import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";

const productionMode = process.env.BUILD === "production";

const config = {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "esm"
  },
  plugins: [typescript(), resolve()]
};

export default async args => {
  if (productionMode) {
    const { terser } = await import("rollup-plugin-terser");
    config.plugins.push(terser());
    config.output.file = "dist/bundle-prod.js";
  }

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

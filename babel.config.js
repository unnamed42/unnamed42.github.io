module.exports = {
  presets: [
    ["@babel/preset-env", {
      exclude: [
        "transform-regenerator",
        "transform-async-to-generator"
      ],
      useBuiltIns: "entry",
      corejs: { version: "3.15" }
    }],
    ["@babel/preset-typescript", {
      onlyRemoveTypeImports: true, // recommended for fork-ts-webpack-plugin
    }]
  ],
  plugins: [
    "babel-plugin-transform-async-to-promises",
    ["@babel/plugin-transform-react-jsx", {
      runtime: "automatic",
      importSource: "preact"
    }],
    ["@babel/plugin-transform-runtime", {
      regenerator: false,
    }],
  ]
}

module.exports = {
  presets: [
    ["@babel/preset-env", {
      exclude: [
        "transform-regenerator",
        "transform-async-to-generator"
      ]
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
      corejs: 3,
      useESModules: true
    }],
  ]
}

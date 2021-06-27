import { merge } from "webpack-merge";
import common from "./webpack.base";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const config = merge(common, {
  mode: "production",
  performance: {
    hints: "error",
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          }
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
});

export default config;

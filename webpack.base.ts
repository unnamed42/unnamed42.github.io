import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { join, resolve } from "path";
import type { Configuration } from "webpack";

const root = resolve("./");

const config: Configuration = {
  entry: join(root, "/src/index.tsx"),
  output: {
    path: join(root, "/dist"),
    filename: "static/[name].[fullhash:5].js",
    chunkFilename: "static/[name].[fullhash:5].js",
    assetModuleFilename: "static/[hash][ext][query]",
    clean: true,
    publicPath: "/"
  },
  performance: {
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@": join(root, "/src"),
      "@public": join(root, "/public"),
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat"
    }
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: { cacheDirectory: true }
      },
      {
        test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
        type: "asset/resource"
      },
      {
        test: /\.(c|s[ac])ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { esModule: true }
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              modules: {
                auto: /\.mod\.(c|s[ac])ss$/,
                exportLocalsConvention: "camelCaseOnly",
                localIdentName: process.env.NODE_ENV === "development" ?
                  "[path][name]__[local]--[hash:base64:5]" :
                  "[hash:base64:5]"
              },
              importLoaders: 2,
              esModule: true,
            }
          },
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: join(root, "/src/index.html"),
      minify: true
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: "write-references"
      }
    }),
    new MiniCssExtractPlugin({
      filename: "static/[name].[fullhash:5].css",
      chunkFilename: "static/[name].[fullhash:5].css",
    })
  ]
};

export default config;

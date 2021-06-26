import { resolve, join } from "path";
import type { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { loader as MiniCssExtractLoader } from "mini-css-extract-plugin";

const root = resolve("./");

const config: Configuration = {
  entry: join(root, "/src/index.tsx"),
  output: {
    path: join(root, "/dist"),
    filename: "static/[name].[fullhash:5].js",
    chunkFilename: "static/[name].[fullhash:5].js",
    publicPath: ""
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
        loader: require.resolve("file-loader"),
        options: { outputPath: "assets" }
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractLoader,
            options: { esModule: true }
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              modules: {
                auto: /\.mod\.s?css$/,
                exportLocalsConvention: "camelCaseOnly"
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
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : "error",
  },
  plugins: [
    new CleanWebpackPlugin(),
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
    })
  ]
};

export default config;

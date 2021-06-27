import { merge } from "webpack-merge";
import common from "./webpack.base";
import type { } from "webpack-dev-server";
import { resolve } from "path";

// temp fix for webpack-dev-server v4 beta
declare module "webpack-dev-server" {
  interface Configuration {
    static?: string[];
    firewall?: boolean;
  }
}

const config = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  performance: {
    hints: "warning",
  },
  devServer: {
    static: [resolve(__dirname, "dist")],
    host: "0.0.0.0",
    firewall: false,
  },
})

export default config;

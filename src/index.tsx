if (process.env.NODE_ENV === "development") {
  require("preact/debug");
}

import { FunctionComponent, render } from "preact";
import { Switch, Route, Router } from "wouter-preact";
import { IntlProvider } from "preact-i18n";
import lang from "@/i18n/zh-Hans.json";
import { Home } from "./views/home";

const Routes: FunctionComponent = () => <Router><Switch>
  <Route path="/"><Home /></Route>
  <Route>404</Route>
</Switch></Router>;

render(
  <IntlProvider definition={lang}>
    <Routes />
  </IntlProvider>
  , document.getElementById("root")!);

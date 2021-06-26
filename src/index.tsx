import { FunctionComponent, render } from "preact";
import { Switch, Route } from "wouter-preact";
import { IntlProvider } from "preact-i18n";
import lang from "@/i18n/zh-Hans.json";
import { Home } from "./views/home";

const Routes: FunctionComponent = () => <Switch>
  <Route path="/index"><Home /></Route>
  <Route>404</Route>
</Switch>;

render(
  <IntlProvider definition={lang}>
    <Routes />
  </IntlProvider>
  , document.getElementById("root")!);

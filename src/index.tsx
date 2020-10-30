import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "@vkontakte/vkui/dist/vkui.css";
import "mobx-react-lite/batchingForReactDom";
import { Provider, rootStore } from "./feature/stores";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn:
    "https://f51d2671361146edae7044b1c6b71c6a@o428836.ingest.sentry.io/5374611",
});

ReactDOM.render(
  <Provider value={rootStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);

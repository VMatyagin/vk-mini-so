import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "@vkontakte/vkui/dist/vkui.css";
import "mobx-react-lite/batchingForReactDom";
import { Provider, rootStore } from "./features/stores";

ReactDOM.render(
  <Provider value={rootStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);

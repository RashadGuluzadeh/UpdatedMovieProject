import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./state/store";
import App from "./App";
import I18nProvider from "./i18n/I18nProvider";
import { hideSplash } from "./utils/splash";

import "./index.css";

const SPLASH_TIMEOUT_MS = 4000;

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element in index.html");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

// Safety net: never leave the splash up, even if a page never reports ready.
setTimeout(hideSplash, SPLASH_TIMEOUT_MS);

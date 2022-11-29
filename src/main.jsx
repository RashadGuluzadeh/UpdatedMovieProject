import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./state/store";
// import App from "./App";
const App = lazy(() => import("./App"));

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<div className="load-center"><div className="ring"></div><span className="loading">loading...</span></div>}>
        <App />
      </Suspense>
    </Provider>
  </BrowserRouter>
);

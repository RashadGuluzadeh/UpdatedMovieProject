import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./state/store";
// import App from "./App";
// const App =  lazy(() => import("./App"));

const App = lazy(() => {
  return Promise.all([
    import("./App"),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(([moduleExports]) => moduleExports);
});

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="load-center">
            <div className="ring"></div>
            <span className="loading">loading...</span>
          </div>
        }
      >
        <App />
      </Suspense>
    </Provider>
  </BrowserRouter>
);

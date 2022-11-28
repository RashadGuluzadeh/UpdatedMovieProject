import React, { useState } from "react";
import { Route} from "react-router-dom";
// import './App.css'
import MainPage from "./pages/MainPage";
import ListPage from "./pages/ListPage";

import "./reset.css";

function App() {
  return (
    <div className="App font-josefin">
        <Route path="/" exact component={MainPage} />
        <Route path="/list/:id" exact component={ListPage} />
    </div>
  );
}

export default App;

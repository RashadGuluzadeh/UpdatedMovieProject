import React, { useState } from "react";
import { Route } from "react-router-dom";
// import './App.css'
import MainPage from "./pages/MainPage";
import ListPage from "./pages/ListPage";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import "./reset.css";

function App() {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="App font-josefin">
        <Route path="/" exact component={MainPage} />
        <Route path="/list/:id" exact component={ListPage} />
      </div>
    </SkeletonTheme>
  );
}

export default App;

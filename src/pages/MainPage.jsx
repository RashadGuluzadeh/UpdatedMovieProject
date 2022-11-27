import React, { useState } from "react";
import Header from "../components/Header/";
import Movies from "../components/Movies";
import SlideShow from "../components/SlideShow";
import Favorites from "../components/Favorites";

const MainPage = () => {
  const [sideBar, setSideBar] = useState(false);

  const toggleSideBar = () => {
    setSideBar((prevState) => !prevState);
  };

  return (
    <div>
      <Header openSideBar={toggleSideBar} />
      <SlideShow />
      <Movies />
      <Favorites sideBar={sideBar} closeSideBar={toggleSideBar}/>
    </div>
  );
};

export default MainPage;

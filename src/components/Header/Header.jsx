import React from "react";
import SearchBox from "../SearchBox/SearchBox";

import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1 className="header_title">Movies</h1>
      <SearchBox />
    </header>
  );
};

export default Header;

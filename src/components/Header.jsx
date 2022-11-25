import React from "react";
import SearchBox from "./SearchBox/";


const Header = () => {
  return (
    <header className="bg-[#2A3990] flex items-center p-[15px] justify-around">
      <h1 className="text-white text-5xl inline tracking-[-3px] h-[35px]">Movies</h1>
      <SearchBox />
    </header>
  );
};

export default Header;

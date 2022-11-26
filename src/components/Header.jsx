import React from "react";
import SearchBox from "./SearchBox/";
import { BsFillBookmarkHeartFill } from "react-icons/bs";

const Header = () => {
  return (
    <header className="bg-[#00005c] flex items-center p-[15px] justify-between w-full px-20">
      <h1 className="text-white text-5xl inline tracking-[-3px] h-[35px]">
        Movies
      </h1>
      <div className="flex gap-10">
        <SearchBox />
        <div className="text-white text-4xl flex justify-center items-center mt-2">
          <BsFillBookmarkHeartFill />
        </div>
      </div>
    </header>
  );
};

export default Header;

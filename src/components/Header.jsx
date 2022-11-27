import React, { useState } from "react";
import SearchBox from "./SearchBox/";
import { BsFillBookmarkHeartFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const Header = ({ openSideBar }) => {
  const { listMovies} = useSelector((state) => state.data)

  return (
    <header className="bg-[#00005c] flex items-center p-[15px] justify-between w-full px-20">
      <h1 className="text-white text-5xl inline tracking-[-3px] h-[35px]">
        Movies
      </h1>
      <div className="flex gap-10">
        <SearchBox />
        <div className="text-white relative text-4xl flex justify-center items-center mt-2  text-center">
          <button onClick={openSideBar}>
            <BsFillBookmarkHeartFill />
          </button>
          <p className="absolute top-[-5px] right-[-5px] bg-red-500 px-2 rounded-full text-sm" >{listMovies.length}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

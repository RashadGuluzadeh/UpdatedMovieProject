import React, { useState } from "react";
import SearchBox from "./SearchBox/";
import { BsFillBookmarkHeartFill  } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { removeListMovie } from "../state/actions";
import Favorites from "./Favorites";

const Header = () => {
  const [menuClass, SetMenuClass] = useState("menu hidden");
  const [isFavoritesClicked, SetIsFavoriteClicked] = useState(false);
  const { listMovies } = useSelector((state) => state.data);
  const click = () => {
    if (!isFavoritesClicked) {
      SetMenuClass("menu visible");
    } else {
      SetMenuClass("menu hidden");
    }
  };

  return (
    <header className="bg-[#00005c] flex items-center p-[15px] justify-between w-full px-20">
      <h1 className="text-white text-5xl inline tracking-[-3px] h-[35px]">
        Movies
      </h1>
      <div className="flex gap-10">
        <SearchBox />
        <div className="text-white text-4xl flex justify-center items-center mt-2">
          <button>
            <BsFillBookmarkHeartFill />
            <Favorites />
          </button>
        </div>
        </div>
    </header>
  );
};

export default Header;

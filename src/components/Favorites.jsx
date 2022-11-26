import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RiDeleteBin5Line, RiCloseFill } from "react-icons/ri"; 
import { removeListMovie } from "../state/actions";
 

const Favorites = () => {
  const { listMovies } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  return (
    <div className="w-80 absolute z-10 right-0 h-full bg-[#151312] top-0 shadow-indigo-500/40 list-none pt-8 px-8 text-xl">
      <h1 className="text-white text-5xl mb-4">Favorites</h1>
      {listMovies.map((favorites) => (
        <li
          className="text-white w-full flex justify-between mb-4"
          key={favorites.id}
        >
          {favorites.title}
          <button
            onClick={() => dispatch(removeListMovie(favorites.id))}
            className="ml-8 text-red-700 justify-end"
          >
            <RiDeleteBin5Line />
          </button>
        </li>
      ))}
    </div>
  );
};

export default Favorites;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RiDeleteBin5Line, RiCloseFill } from "react-icons/ri";
import { removeListMovie, setLinkActive } from "../state/actions";
import axios from "axios";

const Favorites = ({ sideBar, closeSideBar }) => {
  const { listMovies, linkActive } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [listLink, setListLink] = useState("#");
  const handleInput = (e) => {
    setTitle(e.target.value);
  };

  const saveList = () => {
    dispatch(setLinkActive(true));
    axios
      .post("https://acb-api.algoritmika.org/api/movies/list", {
        title: title,
        movies: listMovies.map((item) => item.id),
      })
      .then((res) => {
        setListLink(res.data.id);
        console.log(res.data.id);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  // dispatch(setLinkActive(true))
  return (
    <div className={sideBar ? "sidebar sidebar--open" : "sidebar"}>
      <button
        onClick={closeSideBar}
        className="text-red-600 absolute text-5xl top-0 right-0  rounded-3xl mt-4"
      >
        <RiCloseFill />
      </button>
      <h1 className="text-white text-5xl mb-4">Favorites</h1>
      <input
        className="w-full mb-8 p-2 outline-none"
        value={title}
        placeholder="Enter the name of the list"
        onChange={handleInput}
        disabled={linkActive}
      />
      {listMovies.map((favorites) => (
        <li
          className="text-white w-full flex justify-between mb-4 items-center"
          key={favorites.id}
        >
          {favorites.title}
          <button
            onClick={() => dispatch(removeListMovie(favorites.id))}
            className="ml-8 disabled:cursor-not-allowed text-red-700 justify-end bg-[rgba(255,255,255,0.1)] py-1 px-2 h-[30px] rounded-full"
            disabled={linkActive}
          >
            <RiDeleteBin5Line />
          </button>
        </li>
      ))}
      <button
        onClick={saveList}
        type="button"
        className={`text-white disabled:cursor-not-allowed bg-blue-500 p-2 w-48 text-2xl  ${
          linkActive ? "link__none" : null
        }`}
        disabled={title === '' || listMovies.length === 0}
      >
        Save List
      </button>
      <a
        href={`http://127.0.0.1:5173/list/${listLink}`}
        target="_blank"
        rel="noopener norefer"
        className={`link__none text-white bg-blue-500 w-48 text-center p-2  ${linkActive ? "link__block" : null}`}
      >
        Share with friends
      </a>
    </div>
  );
};

export default Favorites;

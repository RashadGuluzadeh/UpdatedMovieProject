import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addMovies, getMovies } from "../state/actions";

const SearchBox = () => {
  const [search, setSearch] = useState("");
  const [skeleton, setSkeleton] = useState(true);

  const searchHandler = (event) => {
    setSearch(event.target.value);
  };

  const handleKeyDown  = (e) => {
    if (e.key === "Enter") {
      getMovies(search)
        .then((res) => dispatch(addMovies(res)))
        .catch((err) => {
          dispatch(addMovies([]));
          return err;
        });
      setTimeout(() => {
        window.scrollTo({ top: 700, behavior: "smooth" });
        setSearch('');
      }, 800);
    }
  };

  const searchBoxSubmitHandler = (event) => {
    event.preventDefault();
  };

  const scrollToMovies = () => {
    getMovies(search)
      .then((res) => dispatch(addMovies(res)))
      .catch((err) => {
        dispatch(addMovies([]));
        return err;
      });
    setSkeleton(false);
    setTimeout(() => {
      window.scrollTo({ top: 700, behavior: "smooth" });
      setSearch('');
    }, 800);
  };

  const dispatch = useDispatch();
  return (
    <form className="flex relative" onSubmit={searchBoxSubmitHandler}>
      <label>
        <input
          onKeyDown={handleKeyDown}
          className="mt-[10px] w-[350px] text-[15px] py-[10px] px-[5px] outline-none "
          type="text"
          placeholder="For example, Shawshank Redemption"
          value={search}
          onChange={searchHandler}
        />
      </label>
      <p className="w-[20px] absolute right-[85px] top-5 h-[20px] inline-block bg-black rotate-45"></p>
      <button
        onClick={() => {
          scrollToMovies();
        }}
        className="bg-black mt-[9px] py-[5px] px-[10px] text-[#ffeedb] outline-none w-[100px] text-[18px]"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;

import React, { useState } from "react";
import { useDispatch } from "react-redux";

const API_IMG = "https://image.tmdb.org/t/p/w500/";

const MovieItem = ({title, poster_path, release_date}) => {
  const dispatch = useDispatch();
  return (
      <div className=" relative flex flex-col justify-center item-center text-center p-4 bg-[#151312] shadow-lg backdrop-4">
        <button className='text-white bg-blue-600 text-4xl px-4 py-1 absolute top-[-15px] right-[-15px] rounded-3xl' type='button'>+</button>
        <img  className='w-56 flex justify-center' src={API_IMG+poster_path}/>
        <div className="inline w-56 text-center">
            <h3 className="text-white text-xl mt-4 h-16">
                {title}
            </h3>
            <p className="text-white text-xl" >{release_date}</p>
        </div>
      </div>
  );
};

export default MovieItem;

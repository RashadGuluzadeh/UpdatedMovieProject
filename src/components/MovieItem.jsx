import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addListMovie,  } from "../state/actions/index";

const API_IMG = "https://image.tmdb.org/t/p/w500/";

const MovieItem = ({title, poster_path, release_date, id, disabled}) => {
  const dispatch = useDispatch();
  const  { linkActive }  = useSelector((state) => state.data) 
  return (
      <div className=" relative flex flex-col justify-center item-center text-center p-4 bg-[#151312] shadow-lg backdrop-4">
        <button disabled={disabled || linkActive} onClick={() => dispatch(addListMovie(id))} type='button' className=' disabled:cursor-not-allowed text-white w-16 h-16 bg-blue-600 ease-in-out text-3xl px-5 py-3 absolute top-[-15px] right-[-15px] rounded-[50px]'>{!disabled ? "+" : "✓"}</button>
        <img  className='w-72 flex justify-center' src={API_IMG+poster_path}/>
        <div className="inline w-72 text-center">
            <h3 className="text-white text-xl mt-4 h-16">
                {title}
            </h3>
            <p className="text-white text-xl" >{release_date}</p>
        </div>
      </div>
  );
};

export default MovieItem;

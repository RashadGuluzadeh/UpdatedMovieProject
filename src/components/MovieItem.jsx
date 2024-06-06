import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addListMovie,  } from "../state/actions/index";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import noImagepng from "../assets/no-image.png"

const API_IMG = "https://image.tmdb.org/t/p/w500/";

const MovieItem = ({title, poster_path, release_date, id, disabled}) => {
  const dispatch = useDispatch();
  const  { linkActive }  = useSelector((state) => state.data) 
  return (
      <div className=" relative flex flex-col justify-center item-center text-center p-4 bg-[#151312] shadow-lg backdrop-4">
        <button disabled={disabled || linkActive} onClick={() => dispatch(addListMovie(id))} type='button' className=' hover:scale-110 hover:duration-300 disabled:cursor-not-allowed text-white  bg-blue-600 ease-in-out text-3xl px-5 py-5 absolute top-[-15px] right-[-15px] rounded-[50px] text-center'>{!disabled ? <AiOutlinePlus/> : <AiOutlineCheck />}</button>
        <img  className='w-80 h-[480px] flex justify-center text-white ' src={poster_path ? API_IMG+poster_path: noImagepng } alt={title}/>
        <div className="inline w-80 text-center">
            <h3 className="text-white text-xl mt-4 h-16">
                {title}
            </h3>
            <p className="text-white text-xl" >{release_date.split("-").reverse().join("/")}</p>
        </div>
      </div>
  );
};

export default MovieItem;

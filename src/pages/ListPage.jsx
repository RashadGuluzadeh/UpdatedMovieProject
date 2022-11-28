import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getPostMovies } from "../state/actions/index.js";

import { BsFillStarFill, BsFillCalendarFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { IoLanguageOutline } from "react-icons/io5";

const API_IMG = "https://image.tmdb.org/t/p/w500/";

const ListPage = (props) => {
  const [title, setTitle] = useState("");
  const id = props.match.params.id;
  const { postMovies } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`https://acb-api.algoritmika.org/api/movies/list/${id}`)
      .then((res) => res.data)
      .then((data) => {
        setTitle(data.title);
        data.movies.forEach((id) => dispatch(getPostMovies(id)));
        console.log(data.movies)
      });
  }, []);
  return (
    <div className="text-white flex justify-center mt-12 mb-12 flex-col items-center">
      <h1 className=" bg-[#28272a] w-[70%] text-5xl text-center p-4 ">{title}</h1>
      <div className="flex flex-col justify-center w-[70%] ">
        {postMovies.map((item) => (
          <div key={item[0].id} className='w-full flex gap-20 bg-[#28272a] mt-8 p-8 '>
     <img
              className="w-70 h-[400px] inline-block mt-10"
              src={API_IMG + item[0].poster_path}
            ></img>
            <div className="text-white mt-10 max-w-xl !flex !flex-col">
              <div className="flex justify-between">
                <h1 className="!text-4xl">{item[0].title}</h1>
                <div className="flex gap-5 text-amber-400">
                  <p className="flex text-4xl text-white">
                    {item[0].vote_average}
                  </p>
                  <p className="!bg-yellow text-3xl">
                    <BsFillStarFill />
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-lightgrey text-xl mt-5 items-center text-center">
                <p className="flex gap-4 items-center">
                  {" "}
                  <BsFillCalendarFill />
                  {item[0].release_date}
                </p>{" "}
                |
                <p className="flex  items-center gap-4 text-2xl">
                  {" "}
                  <IoIosPeople />
                  {item[0].vote_count}
                </p>{" "}
                |
                <p className="flex gap-4 items-center">
                  {" "}
                  <IoLanguageOutline />
                  {item[0].original_language}
                </p>
              </div>

              <div className="mt-8">
                <p className="!inline border-solid border-b-4 border-red-500 text-2xl pb-2">
                  Overview
                </p>
                <p className="mt-5 text-xl w-[650px]">{item[0].overview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListPage;

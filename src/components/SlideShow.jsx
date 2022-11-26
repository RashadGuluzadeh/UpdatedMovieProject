import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSlideShowdata } from "../state/actions";
import Slider from "react-slick";
import { BsFillStarFill } from "react-icons/bs";

import "../slider.css";

const API_IMG = "https://image.tmdb.org/t/p/w500/";

const SlideShow = () => {
  const { slideShowdata } = useSelector((state) => state.data);
  console.log(slideShowdata)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSlideShowdata());
  }, []);

  const settings = {
    dots: true,
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    cssEase: "linear",
  };
  return (
    <div>
      <Slider {...settings}>
        {slideShowdata.map((slide) => (
          <div
            key={slide.genre_ids[0]}
            className="mt-16 bg-[#151312]  !flex gap-32 justify-center p-8 pb-16 max-w-7xl mx-auto mb-4"
          >
            <img
              className="w-70 h-[400px] inline-block mt-10"
              src={API_IMG + slide.poster_path}
            ></img>
            <div className="text-white mt-10 max-w-xl !flex !flex-col">
              <div className="flex justify-between">
                <h1 className="!text-4xl">{slide.title}</h1>
                <div className="flex gap-5 text-amber-400">
                  <p className="flex text-4xl text-white">
                    {slide.vote_average}
                  </p>
                  <p className="!bg-yellow text-3xl">
                    <BsFillStarFill />
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-lightgrey text-xl mt-5">
                <p>{slide.release_date}</p> |<p>{slide.vote_count}</p> |
                <p>{slide.original_language}</p>
              </div>

              <div className="mt-8">
                <p className="!inline border-solid border-b-4 border-red-500 text-2xl pb-2">
                  Overview
                </p>
                <p className="mt-5 text-xl w-[650px]">{slide.overview}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SlideShow;

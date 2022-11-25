import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSlideShowdata } from "../state/actions";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_IMG="https://image.tmdb.org/t/p/w500/";

const SlideShow = () => {

  const { data } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  console.log(data);
  useEffect(() => {
    dispatch(getSlideShowdata());
  }, []);

  const settings = {
    dots: true,
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
        {data.slice(0,5).map((slide) => (
          <div key={slide.imdbID}>
            <img  className='' src={API_IMG+slide.poster_path}></img>
            <div>
              {slide.title}
              {slide.vote_average}
              {slide.overview}
              {slide.release_date}
              {slide.vote_count}
              {slide.original_language
}

            </div>
            
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SlideShow;

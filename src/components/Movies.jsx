import React, { useState } from "react";
import { useSelector } from "react-redux";
import MovieItem from "./MovieItem";

const Movies = () => {
  const { data } = useSelector((state) => state.data);
  return (
    <div className="flex justify-center mt-20">
      <ul className="grid grid-cols-3 gap-32">
        {data.map((movie) => (
          <div className="flex items-center">
            <MovieItem {...movie}/>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Movies;

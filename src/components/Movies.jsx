import React, { useState } from "react";
import { useSelector } from "react-redux";
import MovieItem from "./MovieItem";

const Movies = () => {
  const { data, listMovies } = useSelector((state) => state.data);
  return (
    <div className="flex justify-center mt-20">
      <ul className="grid grid-cols-3 gap-24">
        {data.map((movie) => (
          <div key={movie.id}className="flex items-center">
            <MovieItem {...movie} disabled={listMovies.find((item) => item.id === movie.id)}/>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Movies;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardSkeleton } from "./Skeleton/CardSkeleton";
import { Loading } from "../state/actions";

import MovieItem from "./MovieItem";

const Movies = ({ closeSideBar }) => {
  const { data, listMovies, loading } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      loading && dispatch(Loading());
    }, 3000);
  }, [loading]);
  return (
    <div className="flex justify-center mt-20" onClick={closeSideBar}>
      <ul className="grid grid-cols-3 gap-20">
        {loading && <CardSkeleton cards={data.length} />}
        {!loading && data.map((movie) => (
          <div key={movie.id} className="flex items-center">
            <MovieItem
              {...movie}
              disabled={listMovies.find((item) => item.id === movie.id)}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Movies;

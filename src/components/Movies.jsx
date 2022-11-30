import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CardSkeleton } from "./CardSkeleton";
import MovieItem from "./MovieItem";

const Movies = ({ closeSideBar }) => {
  const { data, listMovies } = useSelector((state) => state.data);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState("false");
  if(!data){
    setRefresh(true);
    console.log(refresh)
  }
  useEffect(() => {
    setTimeout(() => {
      setIsLoading((prevState) => !prevState);
    }, 6000);
  });
  return (
    <div className="flex justify-center mt-20" onClick={closeSideBar}>
      <ul className="grid grid-cols-3 gap-24">
        {isLoading && <CardSkeleton cards={data.length} />}
        {data.map((movie) => (
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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getPostMovies } from "../state/actions/index.js";

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
      });
  });
  return (
    <div className="text-white">
      <h1>{title}</h1>
      <ul>
        {postMovies.map((item) => (
          <li key={item[0].id}>
            {item[0].title}
            {item[0].release_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPage;

import axios from "axios";
import { ActionTypes } from "./action-types";

const filmName = "Escape Room";

export const getSlideShowdata = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=bcc4ff10c2939665232d75d8bf0ec093&query=${filmName}`
      );
      dispatch({
        type: ActionTypes.SLIDE_SHOW,
        payload: data.results.slice(0, 5),
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const getPostMovies = (id) => {
  return function (dispatch) {
    let postMovies = [];
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=bcc4ff10c2939665232d75d8bf0ec093`).then((res) => res.data).then((data) =>{
      postMovies = [...postMovies, data];
      dispatch(addPostMovie(postMovies));
      console.log(postMovies)
    })
  }
}

export const getMovies = async (search) => {
  const res = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=bcc4ff10c2939665232d75d8bf0ec093&query=${search}`
  );
  const data = res.data.results;
  if (!data) {
    throw console.log("Error");
  }
  return data;
};

export const addMovies = (payload) => ({
  type: ActionTypes.ADD_MOVIES,
  payload,
});

export const addListMovie = (payload) => ({
  type: ActionTypes.ADD_MOVIE_TO_LIST,
  payload,
});

export const removeListMovie = (payload) => ({
  type: ActionTypes.REMOVE_MOVIE_FROM_LIST,
  payload,
});

export const setLinkActive = (payload) => ({
  type: ActionTypes.SET_LINKACTIVE,
  payload,
});

export const addPostMovie = (payload) => ({
  type: ActionTypes.ADD_POST_MOVIES,
  payload,
});

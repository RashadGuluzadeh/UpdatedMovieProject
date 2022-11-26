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

export const getMovies = async (search) => {
  const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=bcc4ff10c2939665232d75d8bf0ec093&query=${search}`)
  const data = res.data.results;
  if( !data) {
    throw console.log("Error");
  }
  return data
};  

export const addMovies = (payload) => ({
  type: ActionTypes.ADD_MOVIES,
  payload,
});

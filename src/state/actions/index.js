import axios from "axios";
import { ActionTypes } from "./action-types";

const filmName = 'Avengers';

export const getSlideShowdata = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=bcc4ff10c2939665232d75d8bf0ec093&query=${filmName}`
      );
      dispatch({
        type: ActionTypes.SLIDE_SHOW,
        payload: data.results,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

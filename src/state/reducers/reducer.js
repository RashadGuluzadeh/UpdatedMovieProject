import { ActionTypes } from "../actions/action-types";

const initialState = {
  slideShowdata: [],
  data: [],
  listMovies: [],
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SLIDE_SHOW:
      return {
        ...state,
        slideShowdata: payload,
      };
    case ActionTypes.ADD_MOVIES:
      return {
        ...state,
        data: payload,
      };
    case ActionTypes.ADD_MOVIE_TO_LIST:
      const movie = state.data.find((item) => item.id === payload);
      const listMovies = [...state.listMovies, { ...movie }];
      return { ...state, listMovies };
    case ActionTypes.REMOVE_MOVIE_FROM_LIST:
        const newMovieList = state.listMovies.filter((item) => item.id !== payload);
        return { ...state, listMovies : newMovieList };
    default:
      return state;
  }
};

export default reducer;

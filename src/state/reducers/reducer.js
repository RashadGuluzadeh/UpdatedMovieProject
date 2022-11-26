import { ActionTypes } from '../actions/action-types'

const initialState = {
    slideShowdata: [],
    data : []
};

const reducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SLIDE_SHOW:
            return {
                ...state,
                slideShowdata : payload
            }
        case ActionTypes.ADD_MOVIES:
            return {
                ...state,
                data : payload
            }
        default : 
            return state;
    }
}

export default reducer
import { ActionTypes } from '../actions/action-types'

const initialState = {
    data: []
};

const reducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SLIDE_SHOW:
            return {
                ...state,
                data : payload
            }
        default : 
            return state;
    }
}

export default reducer
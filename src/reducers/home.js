import {
  RECEIVE_HOME,
  RECEIVE_PAGINATION
} from "../constants/ActionTypes";

const home = (state = {
    realestate: [],
    pagination: []
    }, action) => {

    switch (action.type) {
        case RECEIVE_HOME:
            return {...state, realestate: action.payload};          
    default:
        return state;
  }
}

export default home;
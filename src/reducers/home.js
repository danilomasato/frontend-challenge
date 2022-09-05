import {
  RECEIVE_HOME, 
} from "../constants/ActionTypes";

const home = (state = {
    character: [],
    }, action) => {

    switch (action.type) {
        case RECEIVE_HOME:
            return {...state, character: action.home};         
    default:
        return state;
  }
}

export default home;
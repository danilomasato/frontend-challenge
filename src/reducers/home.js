import {
  RECEIVE_CHARACTER, 
} from "../constants/ActionTypes";

const home = (state = {
    character: [],
    }, action) => {

    switch (action.type) {
        case RECEIVE_CHARACTER:
            return {...state, character: action.character};         
    default:
        return state;
  }
}

export default home;
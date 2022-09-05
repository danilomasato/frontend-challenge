import {
  RECEIVE_CHARACTER, 
} from "../constants/ActionTypes";

const character = (state = {
  characterDetail: [],
    }, action) => {

    switch (action.type) {
        case RECEIVE_CHARACTER:
            return {...state, characterDetail: action.payload};         
    default:
        return state;
  }
}

export default character;
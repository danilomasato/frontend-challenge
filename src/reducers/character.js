import {
  RECEIVE_CHARACTER,
  RECEIVE_AUTHORS
} from "../constants/ActionTypes";

const character = (state = {
  characterDetail: [],
  authors: []
    }, action) => {

    switch (action.type) {  
        case RECEIVE_CHARACTER:
            return {...state, characterDetail: action.payload};
        case RECEIVE_AUTHORS:
            return {...state, authors: action.payload};          
    default:
        return state;
  }
}

export default character;
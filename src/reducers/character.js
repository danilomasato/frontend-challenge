import {
  RECEIVE_CHARACTER,
  RECEIVE_PAGINATION
} from "../constants/ActionTypes";

const character = (state = {
  realestate: [],
  pagination: []
    }, action) => {

    switch (action.type) {  
        case RECEIVE_CHARACTER:
          // console.log('reducer ctr', action)
            return {realestate: action.payload};
        case RECEIVE_PAGINATION:
            return {...state, pagination: action.payload};          
    default:
        return state;
  }
}

export default character;
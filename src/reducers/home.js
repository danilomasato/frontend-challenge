import {
  RECEIVE_HOME, 
  RECEIVE_IMOVEISCACHE
} from "../constants/ActionTypes";

const home = (state = {
    character: [],
    imoveisCache: []
    }, action) => {

    switch (action.type) {
        case RECEIVE_HOME:
            return {...state, character: action.home};   
        case RECEIVE_IMOVEISCACHE:
            return {...state, imoveisCache: action.payload};         
    default:
        return state;
  }
}

export default home;
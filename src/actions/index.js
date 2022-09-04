import * as api from "../api";
import * as types from "../constants/ActionTypes";

export const getCharacterData = () => dispatch => {
  return api.getCharacterData().then(response =>
    dispatch({
      type: types.RECEIVE_CHARACTER,
      character: response
    })
  );
};
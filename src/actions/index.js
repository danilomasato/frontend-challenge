import * as api from "../api";
import * as types from "../constants/ActionTypes";

export const getCharacterData = id => dispatch => {
  return api.getCharacterData(id).then(response => {
    dispatch({
      type: types.RECEIVE_CHARACTER,
      payload: response
    })
    }
  );
};

export const getArticles = () => dispatch => {
  return api.getArticles().then(response => {
    dispatch({
      type: types.RECEIVE_HOME,
      payload: response
    })
  });
};

export const getAuthors = () => dispatch => {
  return api.getAuthors().then(response =>
    dispatch({
      type: types.RECEIVE_AUTHORS,
      payload: response
    })
  );
};

export const getImoveisCache = () => dispatch => {
  return api.getImoveisCache().then(response => {
    dispatch({
      type: types.RECEIVE_IMOVEISCACHE,
      payload: response
    })
  });
};


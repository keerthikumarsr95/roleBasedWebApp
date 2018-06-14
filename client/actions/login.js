import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER, USER_LOGOUT } from './types';
import { setAuthorizationToken } from '../util/helperFunctions';

export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
}

function resetReduxStore() {
  return {
    type: USER_LOGOUT
  }
}

export const loginAction = requestObject => async dispatch => {
  try {
    const response = await axios.post('/api/login/', requestObject);
    const { data } = response;
    if (data.success) {
      let decodedToken = jwtDecode(data.token);
      localStorage.setItem('jwtToken', data.token);
      setAuthorizationToken(data.token);
      dispatch(setCurrentUser(decodedToken));
    }
    return response;
  } catch (error) {

    throw error;
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthorizationToken(false);
    dispatch(resetReduxStore({}));
  }
}
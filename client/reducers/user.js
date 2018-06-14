import { SET_CURRENT_USER } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  type: '',
  user: {}
};

export const currentUserReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: action.payload.type ? true : false,
        type: action.payload.type,
        user: action.payload
      };
    default: return state;
  }
}
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { USER_LOGOUT } from '../actions/types';
import { currentUserReducer } from './user';


const appReducer = combineReducers({
  user: currentUserReducer,
  form: formReducer
});


const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer;
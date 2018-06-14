import axios from 'axios';
import constants from '../components/helper/constants';

export const setAuthorizationToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}


export const ViewLink = {
  [constants.EMPLOYEE]: '/home/employee/view/pending',
  [constants.MANAGER]: '/home/manager/view/pending',
  [constants.ADMIN]: '/home/admin/view'
}
import axios from 'axios';

export const getEmployeesListAction = () => axios.get('/api/employee/');
export const addNewEmployeeAction = (requestObject) => axios.post('/api/employee/add', requestObject);
export const editEmployeeAction = requestObject => axios.post('/api/employee/edit', requestObject);
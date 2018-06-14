import axios from 'axios';

export const getLeavesListAction = (status) => axios.get(`/api/leaves/${status}`);
export const addNewLeavesAction = (requestObject) => axios.post('/api/leaves/add', requestObject);
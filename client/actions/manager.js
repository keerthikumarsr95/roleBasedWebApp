import axios from 'axios';

export const getLeavesForManagerAction = (status, employeeId) => axios.get(`/api/manager/${status}/${employeeId}`);

export const approveLeaveAction = (requestObject) => axios.post('/api/manager/approve', requestObject);

export const declineLeaveAction = (requestObject) => axios.post('/api/manager/decline', requestObject);

export const getTeamMembersListAction = () => axios.get('/api/manager/teammembers');
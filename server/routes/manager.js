import express from 'express';
import { findLeaves, findEmployeesWithProject, addNewLeave, findOneEmployeeWithProject, findOneEmployee, findOneLeave } from '../helper/dbCalls';
import constants from '../helper/constants';
import { emitNewSocketEvent } from '../helper/socketIo';


let router = express.Router();

const newSocketEvent = (eventData) => emitNewSocketEvent(eventData);

router.get('/:status/:employee', async (req, res) => {
  try {
    const { status, employee } = req.params;

    const { type, employeeId } = req;
    let manager = await findOneEmployeeWithProject({ email: employeeId });

    let leavesQueryObject = {
      managerId: manager.managerUUID
    };
    if (employee !== 'undefined') {
      console.log(status, employee);
      leavesQueryObject.employeeId = employee;
    }
    if (status !== 'all') {
      leavesQueryObject.status = status.toUpperCase();
    }

    const leaves = await findLeaves(leavesQueryObject);

    if (leaves.length) {
      res.json({ success: true, leaves, });
    } else {
      res.json({ success: false, message: 'No Leaves Data' });
    }
  } catch (error) {
    res.json({ success: false, message: 'Try Again' });
  }
});

router.post('/approve', async (req, res) => {
  const { employeeId } = req;
  const { requestObject } = req.body;

  if (requestObject.length) {
    const managerData = await findOneEmployee({ email: employeeId });
    for (let index = 0; index < requestObject.length; index++) {
      const leaveId = requestObject[index];
      let leaveFromDb = await findOneLeave({ leaveId: leaveId, managerId: managerData.managerUUID });
      if (leaveFromDb.status === constants.PENDING) {
        leaveFromDb.status = constants.APPROVED;
        const updatedLeave = await leaveFromDb.save();
        newSocketEvent({ employeeId: updatedLeave.employeeId, code: constants.SOCKET_EMPLOYEE_UPDATE_CODE, success: true });
      }
    }
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'No Leaves data to work on.' })
  }
});

router.post('/decline', async (req, res) => {
  const { employeeId } = req;
  const { requestObject } = req.body;

  if (requestObject.length) {
    const managerData = await findOneEmployee({ email: employeeId });
    for (let index = 0; index < requestObject.length; index++) {
      const leaveId = requestObject[index];
      let leaveFromDb = await findOneLeave({ leaveId: leaveId, managerId: managerData.managerUUID });
      if (leaveFromDb.status === constants.PENDING) {
        leaveFromDb.status = constants.NOT_APPROVED;
        const updatedLeave = await leaveFromDb.save();
        newSocketEvent({ employeeId: updatedLeave.employeeId, code: constants.SOCKET_EMPLOYEE_UPDATE_CODE, success: false });
      }
    }
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'No Leaves data to work on.' })
  }
});

router.get('/teammembers', async (req, res) => {
  const { employeeId } = req;
  let managerData = await findOneEmployeeWithProject({ email: employeeId });
  if (managerData) {
    console.log(managerData);

    const teamMembers = await findEmployeesWithProject({ type: constants.EMPLOYEE, managerUUID: managerData.managerUUID }, { password: 0, createdBy: 0 });
    if (teamMembers.length) {
      res.json({ success: true, teamMembers });
    } else {
      res.json({ success: false, message: 'No team members data' });
    }
  } else {
    res.json({ success: false, message: 'No manager data' });
  }
});

export default router;
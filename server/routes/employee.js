import express from 'express';
import { findLeaves, findEmployeesWithProject, addNewLeave, findOneEmployeeWithProject, findOneEmployee } from '../helper/dbCalls';
import constants from '../helper/constants';
import { getUUID } from '../helper/helperFunctions';
import { emitNewSocketEvent } from '../helper/socketIo';

let router = express.Router();

const newSocketEvent = (eventData) => emitNewSocketEvent(eventData);


router.get('/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const { type, employeeId } = req;
    const employeeData = await findOneEmployeeWithProject({ email: employeeId }, { password: 0 });
    let leavesQueryObject = {
      employeeId: employeeId
    };
    if (status !== 'all') {
      leavesQueryObject.status = status.toUpperCase();
    }
    const leaves = await findLeaves(leavesQueryObject);
    if (leaves.length) {
      res.json({ success: true, leaves, employeeData });
    } else {
      res.json({ success: false, employeeData, message: 'No Leaves Data' });
    }
  } catch (error) {
    res.json({ success: false, message: 'Try Again' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { employeeId } = req;
    const { requestObject } = req.body;
    const employeeData = await findOneEmployeeWithProject({ email: employeeId }, { password: 0 });
    console.log(requestObject);
    console.log(employeeData);

    if (employeeData.managerUUID) {
      const managerData = await findOneEmployeeWithProject({ managerUUID: employeeData.managerUUID, type: constants.MANAGER });
      if (managerData) {
        const leaveUUID = getUUID();
        const leavesInitObject = {
          leaveId: leaveUUID,
          employeeId: employeeData.email,
          employeeName: employeeData.name,
          status: constants.PENDING,
          reason: requestObject.reason,
          managerId: employeeData.managerUUID,
        }
        let addedLeave = await addNewLeave(leavesInitObject);
        if (addedLeave) {
          newSocketEvent({ employeeId: managerData.email, code: constants.SOCKET_MANAGER_LEAVE_UPDATE_CODE });
          res.json({ success: true, });
        } else {
          res.json({ success: false, message: 'Error while applying for leave. Try again' });
        }
      } else {
        res.json({ success: false, message: 'No manager info available. Contact Admin' });
      }
    } else {
      res.json({ success: false, message: 'No manager info available. Contact Admin' });
    }
  } catch (error) {
    res.json({ success: false, message: 'Try Again' });
  }
});


export default router;
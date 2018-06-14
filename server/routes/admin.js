import express from 'express';
import bcrypt from 'bcrypt';
import { findOneEmployee, addNewEmployee, findEmployeesWithProject, findOneEmployeeWithProject, findAndUpdateEmployee } from '../helper/dbCalls';
import { getUUID } from '../helper/helperFunctions';
import constants from '../helper/constants';
import { sendEmployeeOnBoardMail } from '../helper/mailer';
let router = express.Router();

router.get('/', async (req, res) => {
  try {
    const employees = await findEmployeesWithProject({}, { password: 0 });
    const managers = await findEmployeesWithProject({ type: constants.MANAGER }, { name: 1, managerUUID: 1 });
    res.json({ success: true, employees, managers });

  } catch (error) {
    console.log(error);

    res.json({ success: false });
  }

});

router.post('/add', async (req, res) => {
  const { requestObject } = req.body;
  console.log(requestObject);
  const { type, employeeId } = req;

  let employee = await findOneEmployee({ email: requestObject.email });
  if (employee) {

    return res.json({ success: false, message: 'An employee with such name exists' });

  } else {

    const password = getUUID();
    const password_digest = await bcrypt.hashSync(password, 10);
    const type = requestObject.isManager ? constants.MANAGER : constants.EMPLOYEE;
    let initObject = {
      name: requestObject.name,
      // employeeId: { type: String, default: undefined },
      type: type,
      password: password_digest,
      email: requestObject.email,
      createdBy: employeeId
    }
    if ((initObject.type === constants.EMPLOYEE) && requestObject.managerUUID) {
      const manager = await findOneEmployeeWithProject({ managerUUID: requestObject.managerUUID }, { password: 0 });
      initObject.managerName = manager.name;
      initObject.managerUUID = manager.managerUUID;
    } else if (initObject.type === constants.MANAGER) {
      initObject.managerUUID = getUUID();
    }
    console.log('initObject', initObject);

    let newEmployee = await addNewEmployee(initObject);
    console.log('newEmployee', newEmployee);

    if (newEmployee) {
      newEmployee.password = password;
      await sendEmployeeOnBoardMail(newEmployee);
    }

    res.json({ success: true });
  }
});

router.post('/edit', async (req, res) => {
  const { requestObject } = req.body;

  let employee = await findOneEmployee({ email: requestObject.email });
  if (!employee) {
    return res.json({ success: false, message: 'There is no such employee' });
  } else {
    const type = requestObject.isManager ? constants.MANAGER : constants.EMPLOYEE;
    const existingType = employee.type;

    if ((existingType === constants.EMPLOYEE) && requestObject.managerUUID) {
      const manager = await findOneEmployeeWithProject({ managerUUID: requestObject.managerUUID }, { password: 0 });
      employee.managerName = manager.name;
      employee.managerUUID = manager.managerUUID;
    }

    if ((existingType === constants.MANAGER) && (type !== constants.MANAGER)) {
      employee.managerName = '';
      employee.managerUUID = '';
      await findAndUpdateEmployee({ type: constants.EMPLOYEE, managerUUID: employee.managerUUID }, { managerName: '', managerUUID: "" });
    } else if ((existingType === constants.EMPLOYEE) && (type === constants.MANAGER)) {
      employee.managerName = '';
      employee.managerUUID = getUUID();
    }
    employee.name = requestObject.name;
    employee.type = type;
    employee.email = requestObject.email;
    employee.updatedBy = requestObject.currentUser;

    await employee.save();

    res.json({ success: true });
  }
});

export default router;
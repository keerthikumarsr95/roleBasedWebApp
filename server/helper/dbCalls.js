import Employees from '../models/employees';
import Leaves from '../models/leaves';

export const addNewEmployee = (initObject) => {
  let newEmployee = new Employees(initObject);
  return newEmployee.save();
}

export const findOneEmployee = queryObject => Employees.findOne(queryObject);
export const findOneEmployeeWithProject = (queryObject, projectQuery) => Employees.findOne(queryObject, projectQuery);


export const findEmployees = queryObject => Employees.find(queryObject);

export const findEmployeesWithProject = (queryObject, projectQuery) => Employees.find(queryObject, projectQuery);

export const findAndUpdateEmployee = async (queryObject, updateObject) => {
  let employees = await findEmployees(queryObject);
  if (employees.length) {
    const keys = Object.keys(updateObject);
    let updatedData = [];
    for (let index = 0; index < employees.length; index++) {
      const employee = employees[index];
      keys.forEach(k => employee[k] = updateObject[k]);
      const updatedEmployee = await employee.save();
      updatedData.push(updatedEmployee);
    }
    return updatedData;
  } else {
    return null;
  }

}

export const findLeaves = queryObject => Leaves.find(queryObject).sort({ createdAt: -1 });

export const findOneLeave = queryObject => Leaves.findOne(queryObject);

export const addNewLeave = (initObject) => {
  let newLeave = new Leaves(initObject);
  return newLeave.save();
}
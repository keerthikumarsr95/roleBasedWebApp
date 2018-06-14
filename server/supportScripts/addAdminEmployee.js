const bcrypt = require('bcrypt');
import mongoose from 'mongoose';
import { addNewEmployee } from '../helper/dbCalls';
import constants from '../helper/constants';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/rolebasedwebapp', { useMongoClient: true });


const addAdminEmployee = async () => {
  console.log('Initiated');
  const password = '6ede3e71-6fc4-4a24-a596-1fbd905c1ccf';

  const password_digest = await bcrypt.hashSync(password, 10);

  const initObject = {
    name: 'admin',
    // employeeId: { type: String, default: undefined },
    type: constants.ADMIN,
    password: password_digest,
    email: 'admin@rolebasedwebapp.com',
    createdBy: 'admin@rolebasedwebapp.com',
  };

  let adminEmployee = await addNewEmployee(initObject);
  console.log('completed');
  console.log('User Name:');
  console.log(adminEmployee.email);
  console.log('Password');
  console.log(password);
}

addAdminEmployee();
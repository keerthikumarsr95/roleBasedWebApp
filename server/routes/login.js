import express from 'express';
import { findOneEmployee } from '../helper/dbCalls';
import config from '../config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


let router = express.Router();

router.post('/', async (req, res) => {
  const { userName, password } = req.body;
  console.log(userName, password);
  let queryObject = { email: userName };
  console.log('queryObject', queryObject);

  let employeeFromDb = await findOneEmployee(queryObject);
  console.log(employeeFromDb);

  if (!employeeFromDb) {
    res.status(401).json({ success: false, message: 'Invalid user name or password' });
    return;
  }
  console.log(bcrypt.compareSync(password, employeeFromDb.password));

  if (!bcrypt.compareSync(password, employeeFromDb.password)) {
    res.status(401).json({ success: false, message: 'Invalid user name or password' });
    return;
  }
  const employeeInfoObject = {
    type: employeeFromDb.type,
    employeeId: employeeFromDb.email,
    employeeName: employeeFromDb.name
  }
  const token = jwt.sign(employeeInfoObject, config.jwtSecret, { expiresIn: '1d' });

  res.json({ success: true, token: token, employeeInfo: employeeInfoObject })
});

export default router;
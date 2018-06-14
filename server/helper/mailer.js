import nodeMailer from 'nodemailer';
import config from '../config';
import { log } from 'util';

const buildAndReturnMailerDetails = () => ({
  host: config.mailHost,
  port: config.mailPort,
  // secure: true, // use SSL
  auth: {
    user: config.mailUserId,
    pass: config.mailPassword
  }
})

const createTransport = () => {
  let mailOptions = buildAndReturnMailerDetails();
  return nodeMailer.createTransport(mailOptions);
}

const sendMail = (mailContent) => {
  let mailer = createTransport();
  return mailer.sendMail(mailContent);
}

const getHtmlData = (employee) => (`
  Hi ${employee.name},<br/>
  <br/>
  Your login details,<br/>
  User Name: ${employee.email},<br/>
  Password: ${employee.password}<br/>
  <br/>
  Regards,<br/>
  RoleBasedWebApp Team
  `);

export const sendEmployeeOnBoardMail = (employee) => {
  const mailContent = {
    from: config.mailUserId,
    to: employee.email,
    subject: 'Onboard Details',
    html: getHtmlData(employee)
  }

  return sendMail(mailContent);
}
import { verifyToken } from "./helperFunctions";
import config from "../config";

export default async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;
  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  } else {
    return res.status(403).json({ success: false, message: 'No token provided' })
  }

  try {
    if (token) {
      const verifiedToken = await verifyToken(token, config.jwtSecret);
      if (verifiedToken) {
        req.type = verifiedToken.type;
        req.employeeId = verifiedToken.employeeId;
        next()
      } else {
        return res.status(401).json({ success: false, message: 'Failed to authenticate' });
      }
    } else {
      return res.status(403).json({ success: false, message: 'No token provided' })
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Failed to authenticate' });
  }

};
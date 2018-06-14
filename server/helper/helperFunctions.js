import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';

export const getUUID = () => uuid();

export const verifyToken = (token, jwtSecret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
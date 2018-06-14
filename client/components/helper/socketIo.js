import io from 'socket.io-client';
import constants from './constants';

const socket = io();

export const listenToSocket = (employeeId, cb) => {
  socket.on(constants.SOCKET_EMIT_EVENT_NAME_ROLE_BASED_WEB_APP, (socketUpdates) => {
    if (employeeId == socketUpdates.employeeId) {
      cb(socketUpdates)
    }
  });
};

export const checkIfThisNewEventIsForThisComponent = (newUpdateFromSocket, componentSocketCode) => {
  if (newUpdateFromSocket.code === componentSocketCode) {
    return true;
  } else {
    return false;
  }
};
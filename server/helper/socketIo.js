import constants from "./constants";


export const emitNewSocketEvent = (newEmitEventObject) => {
  socket.emit(constants.SOCKET_EMIT_EVENT_NAME_ROLE_BASED_WEB_APP, newEmitEventObject);
}
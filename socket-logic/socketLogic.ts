import { actionTypes as eTypes } from './actionTypes'
import { IConnectUserBroadcast, IDisconnectUserBroadcast, IConnectSelf } from './interfaces'

// Fake DB
interface IConnectionData {
  ip: string
}
const stateMap = new Map<string, IConnectionData>() // NOTE: key - socketId

export function socketLogic(io: any) {
  io.on('connection', function (socket: any) {
    // TODO: This ip detector does not works and unused!
    const ip = socket.conn.remoteAddress // Or socket.handshake.address?
    let eventOnConnect: IConnectSelf

    try {
      stateMap.set(socket.id, { ip })
      eventOnConnect = {
        data: {
          msg: `socket id: ${socket.id}`, // ip
          socketId: socket.id,
          ip,
          totalConnections: stateMap.size,
        },
      }
      io.to(socket.id).emit(eTypes.ME_CONNECTED, eventOnConnect)
      // socket.join(socket.id)
      const eventBroadcastOnConnect: IConnectUserBroadcast = {
        data: {
          ...eventOnConnect.data,
          totalConnections: stateMap.size,
        },
      }
      socket.broadcast.emit(eTypes.USER_SOMEBODY_CONNECTED, eventBroadcastOnConnect)
    } catch (_err) {
      // console.log(err)
    }

    io.stateMap = stateMap

    socket.on('disconnect', function () {
      stateMap.delete(socket.id)
      const eventOnDisconnect: IDisconnectUserBroadcast = {
        data: {
          ...eventOnConnect.data,
          totalConnections: stateMap.size,
        },
      }
      socket.broadcast.emit(eTypes.USER_SOMEBODY_DISCONNECTED, eventOnDisconnect)
    })
  })
  return io
}

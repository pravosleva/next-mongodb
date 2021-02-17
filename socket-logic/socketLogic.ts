import { actionTypes as eTypes } from './actionTypes'
import { IConnectUserBroadcast, IDisconnectUserBroadcast, IConnectSelf } from './interfaces'

// Fake DB
interface IConnectionData {
  ip: string
}
const stateMap = new Map<string, IConnectionData>() // NOTE: key - socketId

export function socketLogic(io: any) {
  io.on('connection', function (socket: any) {
    // const ip = socket.handshake.address
    const ip = socket.conn.remoteAddress

    // eslint-disable-next-line no-console
    // console.log(socket)

    // console.log('=== Somebody connected ===')
    const body0: IConnectSelf = {
      data: {
        msg: `socket id: ${socket.id}`, // ip
        socketId: socket.id,
        ip,
        totalConnections: stateMap.size,
      },
    }
    io.to(socket.id).emit(eTypes.ME_CONNECTED, body0)
    socket.join(socket.id)

    try {
      stateMap.set(socket.id, { ip })
      const body1: IConnectUserBroadcast = {
        data: {
          msg: `socket id: ${socket.id}`, // ip
          socketId: socket.id,
          ip,
          totalConnections: stateMap.size,
        },
      }
      socket.broadcast.emit(eTypes.USER_SOMEBODY_CONNECTED, body1)
    } catch (_err) {
      // console.log(err)
    }

    io.stateMap = stateMap

    socket.on('disconnect', function () {
      // console.log('=== Somebody disconnected ===')
      stateMap.delete(socket.id)
      const body2: IDisconnectUserBroadcast = {
        data: {
          msg: `socket id: ${socket.id}`,
          socketId: socket.id,
          ip,
          totalConnections: stateMap.size,
        },
      }
      socket.broadcast.emit(eTypes.USER_SOMEBODY_DISCONNECTED, body2)
    })
  })
  return io
}

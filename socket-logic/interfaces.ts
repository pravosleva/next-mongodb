export enum EActions {
  ME_CONNECTED = 'ME@CONNECTED',
  USER_SOMEBODY_CONNECTED = 'USER@SOMEBODY_CONNECTED',
  USER_SOMEBODY_DISCONNECTED = 'USER@SOMEBODY_DISCONNECTED',
  NOTE_CREATED = 'NOTE@CREATED',
  NOTE_UPDATED = 'NOTE@UPDATED',
  NOTE_DELETED = 'NOTE@DELETED',
  QR_USED = 'QR@USED',
}

export interface IConnectUserBroadcast {
  data: {
    msg: string
    socketId: string
    ip: string
    totalConnections: number
  }
}

export interface IConnectSelf {
  data: {
    msg: string
    socketId: string
    ip: string
    totalConnections: number
  }
}

export interface IDisconnectUserBroadcast {
  data: {
    msg: string
    socketId: string
    ip: string
    totalConnections: number
  }
}

export interface IMeConnected {
  data: {
    msg: string
    socketId: string
    totalConnections: number
  }
}

export interface IDeletedNote {
  data: {
    id: string
  }
}

interface INote {
  id: string
  title: string
  description: string
  priority?: number
}
export interface IUpdatedNote {
  data: INote
}

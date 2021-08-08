/* eslint-disable no-console */
import { createContext, useReducer, useEffect, useMemo, useContext, useRef, useCallback } from 'react'
import io from 'socket.io-client'
import { EActions, IDeletedNote, IConnectSelf, IDisconnectUserBroadcast } from '~/socket-logic'
import { useNotifsContext } from '~/common/hooks'
import {
  useGlobalAppContext,
  // ELSFields,
} from './GlobalAppContext'
import { httpClient } from '~/utils/httpClient'
// import { useCookies } from 'react-cookie'

const NEXT_APP_SOCKET_API_ENDPOINT = process.env.NEXT_APP_SOCKET_API_ENDPOINT

const initialState = {
  socket: null,
  socketId: null,
  updatedNote: null,
  deletedNoteId: null,
}

export const SocketContext = createContext({
  state: initialState,
})

function reducer(state: any, action: any) {
  switch (action.type) {
    case EActions.ME_CONNECTED:
      return { ...state, socket: action.payload.socket, socketId: action.payload.socketId }
    case 'UNMOUNT':
      return { ...state, socket: null, socketId: null }
    case 'REFRESH_UPDATED_NOTE':
      return { ...state, updatedNote: action.payload }
    case 'UPDATE_DELETED_NOTE_ID':
      return { ...state, deletedNoteId: action.payload }
    default:
      return state
  }
}

const firstRendersToSkip: number = 1

type TGeo = {
  area?: number
  city?: string
  country?: string
  eu?: string
  ll?: number[]
  metro?: number
  range?: number[]
  region?: string
  timezone?: string
}
type TUserDetails = {
  success: boolean
  ip: string
  geo: TGeo
}
const getInfoByGeo = (geo?: TGeo): string => {
  if (!geo) return 'Не удалось определить детали'

  let result = []
  const fieldsForTry = ['country', 'region', 'city']

  // @ts-ignore
  for (const value of fieldsForTry) if (!!geo[value]) result.push(geo[value])

  return result.join(', ')
}

export const SocketContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const isClient = useMemo(() => typeof window !== 'undefined', [typeof window])
  const { addDefaultNotif, addDangerNotif, addSuccessNotif } = useNotifsContext()
  // ---
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [_cookies, setCookie, _removeCookie] = useCookies()
  const {
    handleUpdateOneNote,
    handleRemoveOneNote,
    handleAddOneNote,
    handleSetNotesResponse,
    handleSetAsActiveNote,
    state: globalState,
    resetQR,
    // getFieldFromLS,
  } = useGlobalAppContext()

  // ---
  const handleGetNote = async (id: number) => {
    const res = await httpClient.getNote(id)

    return res
  }
  const handleMeConnected = useCallback(
    async (arg: IConnectSelf, socket: any) => {
      // console.log('--- activeNote')
      // console.log(globalState.activeNote)

      // ---
      // NOTE: Set socketId to cookie for my notifs (QR, etc.)
      // setCookie('socket-id', arg.data.socketId)
      // ---

      // -- Get my IP:
      const userDetails: TUserDetails = await httpClient.getMyIP()
      const { success, geo, ip } = userDetails

      console.log(userDetails)
      if (success && !!ip) {
        const geoInfo = getInfoByGeo(geo)
        addDefaultNotif({
          title: ip,
          message: geoInfo,
          dismiss: {
            duration: 10000,
          },
        })
      }
      // --

      // -- Update socket.id in remote state for EAction.QR_USED support (socket emit)
      httpClient
        .replaceSocketIdInRemoteState({
          newSocketId: socket.id,
        })
        .then(() => {
          addSuccessNotif({
            title: 'Socket: Remote state details',
            message: 'socket.id updated in state; key taken from cookies',
            dismiss: {
              duration: 7000,
            },
          })
        })
        .catch((err) => {
          // addDangerNotif({
          //   title: 'Socket: Remote state details',
          //   message: typeof err === 'string' ? err : err.message || 'No err.message',
          //   dismiss: { duration: 10000, },
          // })
          console.log('ERR: Socket: Remote state details')
          console.log(err)
        })
      // --

      // -- Update active note if necessary:
      if (!!globalState.activeNote?._id && !globalState.activeNote.isLocal) {
        // TODO: Request activeNote._id should be requested
        console.log(`NOTE: Request for globalState.activeNote._id (${globalState.activeNote._id}) required`)

        handleGetNote(globalState.activeNote._id)
          .then(handleSetAsActiveNote)
          .catch((err) => {
            if (typeof err === 'string') {
              addDangerNotif({
                title: 'ERR: Update activeNote by new socket connection',
                message: err,
              })
            }
            console.log(err)
          })
      }
      // --

      // console.log(arg)
      addDefaultNotif({
        title: `Me connected (online: ${arg.data.totalConnections})`,
        message: arg.data.msg,
        // type: 'success',
      })
      dispatch({ type: EActions.ME_CONNECTED, payload: { socket, socketId: arg.data.socketId } })
    },
    [JSON.stringify(globalState.activeNote)]
  )
  const handleMeConnectedRef = useRef(handleMeConnected)
  useEffect(() => {
    handleMeConnectedRef.current = handleMeConnected
  }, [handleMeConnected])
  const handleCreateNote = (arg: any) => {
    // console.log(arg)
    try {
      const title: string = arg.data.title

      addDefaultNotif({
        title: 'Created',
        message: title,
        type: 'info',
      })
      // TODO: Add if validated by current filter settings
      handleAddOneNote(arg.data)
    } catch (err) {
      // console.log(err)
    }
  }
  const handleUpdateNote = (arg: any) => {
    // console.log(arg)
    try {
      const {
        data: { _id },
      } = arg

      addDefaultNotif({
        title: 'Updated',
        message: _id,
        type: 'info',
      })
      dispatch({ type: 'REFRESH_UPDATED_NOTE', payload: arg.data })
      // @ts-ignore
      handleUpdateOneNote(arg.data)
    } catch (err) {
      // console.log(err)
    }
  }
  // ---
  const handleUpdateDeletedNoteId = (id: string) => {
    dispatch({ type: 'UPDATE_DELETED_NOTE_ID', payload: id })
  }
  // ---
  const handleDeleteNote = (arg: IDeletedNote) => {
    // console.log(arg)
    try {
      const {
        data: { id },
      } = arg

      addDefaultNotif({
        title: 'Deleted',
        message: id,
        type: 'info',
      })
      handleUpdateDeletedNoteId(id)
      handleRemoveOneNote(id)
    } catch (err) {
      // console.log(err)
    }
  }
  const handleSomebodyConnected = (arg: any) => {
    // console.log(arg)
    try {
      const {
        data: { msg, totalConnections },
      } = arg

      addDefaultNotif({
        title: `Somebody connected (online: ${totalConnections})`,
        message: msg,
        type: 'info',
      })
    } catch (err) {
      // console.log(err)
    }
  }
  const handleSomebodyDisconnected = (arg: IDisconnectUserBroadcast) => {
    // console.log(arg)
    try {
      const {
        data: { msg, totalConnections },
      } = arg

      addDefaultNotif({
        title: `Somebody disconnected (online: ${totalConnections})`,
        message: msg,
        type: 'info',
      })
    } catch (err) {
      // console.log(err)
    }
  }
  const handleQRUsed = ({ message, haveToBeKilled }: { message: string; haveToBeKilled: boolean }) => {
    if (haveToBeKilled) resetQR()
    addSuccessNotif({
      title: 'QR code',
      message,
      dismiss: {
        duration: 10000,
      },
    })
  }
  const handleGetAllNotes = async () => {
    // let q = '?'
    let res: any[] = []

    /*
    await getFieldFromLS(ELSFields.MainSearch, true)
      .then(async (jsonFromLS) => {
        if (!!jsonFromLS.searchByTitle) q += `q_title=${jsonFromLS.searchByTitle}`
        res = await httpClient.getNotes(`/notes${q}`) // TODO: query
      })
      .catch(async (err) => {
        console.log(err)
        res = await httpClient.getNotes('/notes')
      })
    */
    res = await httpClient.getNotes('/notes')

    return res
  }
  const renderCounterRef = useRef<number>(0)

  useEffect(() => {
    renderCounterRef.current += 1
    if (renderCounterRef.current < firstRendersToSkip) return
    if (isClient) {
      // @ts-ignore
      const socket = io.connect(NEXT_APP_SOCKET_API_ENDPOINT)

      socket.on(EActions.ME_CONNECTED, (arg: any) => {
        handleMeConnectedRef.current(arg, socket)

        // NOTE: is reconnect?
        if (renderCounterRef.current > firstRendersToSkip + 1) {
          handleGetAllNotes()
            .then((res) => {
              handleSetNotesResponse(res)
            })
            .catch((err) => {
              if (typeof err === 'string') {
                addDangerNotif({
                  title: 'ERR: Update list by new socket connection',
                  message: err,
                })
              }
              console.log(err)
            })
        }
      })
      socket.on(EActions.NOTE_CREATED, handleCreateNote)
      socket.on(EActions.NOTE_UPDATED, handleUpdateNote)
      socket.on(EActions.NOTE_DELETED, handleDeleteNote)
      socket.on(EActions.USER_SOMEBODY_CONNECTED, handleSomebodyConnected)
      socket.on(EActions.USER_SOMEBODY_DISCONNECTED, handleSomebodyDisconnected)
      socket.on(EActions.QR_USED, handleQRUsed)

      return () => {
        socket.disconnect()
        socket.removeAllListeners()
        dispatch({ type: 'UNMOUNT', payload: socket })
      }
    }
  }, [isClient])

  return (
    <SocketContext.Provider
      value={{
        state,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)

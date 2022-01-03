import { createContext, useContext, useMemo } from 'react'
import { ReactNotificationOptions as IReactNotificationOptions } from 'react-notifications-component'
import {
  addInfoNotif as _addInfoNotif,
  addSuccessNotif as _addSuccessNotif,
  addDangerNotif as _addDangerNotif,
  addDefaultNotif as _addDefaultNotif,
  addWarningNotif as _addWarningNotif,
} from './addNotif'
import { useWindowSize } from '~/common/hooks'
import ReactNotification from 'react-notifications-component'

export const NotifsContext = createContext({
  addInfoNotif: (_note: Partial<IReactNotificationOptions>): void => {
    throw new Error('addInfoNotif method should be implemented')
  },
  addSuccessNotif: (_note: Partial<IReactNotificationOptions>): void => {
    throw new Error('addSuccessNotif method should be implemented')
  },
  addDangerNotif: (_note: Partial<IReactNotificationOptions>): void => {
    throw new Error('addDangerNotif method should be implemented')
  },
  addDefaultNotif: (_note: Partial<IReactNotificationOptions>): void => {
    throw new Error('addDefaultNotif method should be implemented')
  },
  addWarningNotif: (_note: Partial<IReactNotificationOptions>): void => {
    throw new Error('addWarningNotif method should be implemented')
  },
})

export const NotifsContextProvider = ({ children }: any) => {
  const { width } = useWindowSize()
  // @ts-ignore
  const isMobile = useMemo(() => (!!width ? width <= 767 : false), [width])
  const addInfoNotif = (note: Partial<IReactNotificationOptions>) => {
    if (!window || !document || document?.hidden) return
    _addInfoNotif({ ...note })
  }
  const addSuccessNotif = (note: Partial<IReactNotificationOptions>) => {
    if (!window || !document || document?.hidden) return
    _addSuccessNotif(note)
  }
  const addDangerNotif = (note: Partial<IReactNotificationOptions>) => {
    if (!window || !document || document?.hidden) return
    _addDangerNotif(note)
  }
  const addDefaultNotif = (note: Partial<IReactNotificationOptions>) => {
    if (!window || !document || document?.hidden) return
    _addDefaultNotif(note)
  }
  const addWarningNotif = (note: Partial<IReactNotificationOptions>) => {
    if (!window || !document || document?.hidden) return
    _addWarningNotif(note)
  }

  return (
    <NotifsContext.Provider
      value={{
        addInfoNotif,
        addSuccessNotif,
        addDangerNotif,
        addDefaultNotif,
        addWarningNotif,
      }}
    >
      <>
        <ReactNotification isMobile={isMobile} />
        {children}
      </>
    </NotifsContext.Provider>
  )
}

export const useNotifsContext = () => {
  const notifsContext = useContext(NotifsContext)

  return notifsContext
}

import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import clsx from 'clsx'
import { httpClient } from '~/utils/httpClient'
import { useStyles } from './styles'
import { useAuthContext } from '~/common/hooks'
import { CircularProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useNotifsContext, useGlobalAppContext } from '~/common/hooks'

type TProps = {
  id: string
}

export const Badge0 = ({ id }: TProps) => {
  const classes = useStyles()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { isLogged } = useAuthContext()
  const { state, handleSetAsActiveNote, localNotes } = useGlobalAppContext()
  const { addDangerNotif } = useNotifsContext()
  const { activeNote } = useMemo(() => state, [JSON.stringify(state)])
  const router = useRouter()
  const isActive = useMemo(() => id === activeNote?._id, [activeNote, id])
  const [isFoundAsLocal, setIsFoundAsLocal] = useState<boolean>(false)

  const tryToSearchAsLocal = (id: string): Promise<any> => {
    // NOTE: 1. Попробовать найти в LS
    // NOTE: Если да, то setData()
    const targetNote = localNotes.find(({ id: __id }) => __id === id)

    if (!!targetNote) {
      // @ts-ignore
      return Promise.resolve({ ...targetNote, _id: targetNote.id, isLocal: true })
    } else {
      return Promise.reject('Not found nowhere')
    }
  }

  const handleClick = useCallback(
    (id: string) => {
      if (isFoundAsLocal && !!data) {
        handleSetAsActiveNote({ ...data, _id: data.id, isLocal: true })
        if (router.pathname !== '/') {
          router.push(`/local-notes/${id}`)
          return
        }
      }

      if (router.pathname !== '/') {
        router.push(`/notes/${id}`)
      }

      if (!!state.activeNote && state.activeNote?._id === id) {
        // addDefaultNotif({ title: 'Unnecessary', message: 'Note is active' })
        return
      }

      const fromState = state.notes.find(({ _id }: any) => _id === id)
      if (!!fromState) {
        handleSetAsActiveNote(fromState)
      } else {
        // addDefaultNotif({
        //   title: 'TODO',
        //   message: (
        //     <ul style={{ paddingLeft: '10px' }}>
        //       <li>Get note by id: {id}</li>
        //       <li>Set as Active Note</li>
        //     </ul>
        //   ),
        // })

        tryToSearchAsLocal(id)
          .then((normalizedLocalNote) => {
            setData(normalizedLocalNote)
            handleSetAsActiveNote(normalizedLocalNote)
            setIsFoundAsLocal(true)
            setIsLoaded(true)
            setErrorMsg(null)
          })
          .catch((_err) => {
            httpClient
              .getNote(id)
              .then((data) => {
                handleSetAsActiveNote(data)
              })
              .catch((err) => {
                addDangerNotif({
                  title: 'Error',
                  message: typeof err === 'string' ? err : err.message || 'Not found nowhere',
                })
              })
          })
      }
    },
    [JSON.stringify(state.notes), state.activeNote, handleSetAsActiveNote, localNotes, isFoundAsLocal]
  )

  useEffect(() => {
    tryToSearchAsLocal(id)
      .then((normalizedLocalNote) => {
        setData(normalizedLocalNote)

        if (isActive) handleSetAsActiveNote(normalizedLocalNote)
        setIsFoundAsLocal(true)
        setIsLoaded(true)
        setErrorMsg(null)
      })
      .catch((_err) => {
        setIsLoading(true)
        setErrorMsg(null)
        setData(null)

        httpClient
          .getNoteNoCancel(id)
          .then((data) => {
            setData(data)
            // console.log(data)
            setIsLoaded(true)
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            setErrorMsg(typeof err === 'string' ? err : err.message || 'No err.message')
            setIsLoaded(false)

            addDangerNotif({
              title: 'Error',
              message: typeof err === 'string' ? err : err.message || 'Not found nowhere',
            })
          })
          .finally(() => {
            setIsLoading(false)
          })
      })
  }, [isLogged, id])

  return (
    <li
      onClick={() => handleClick(id)}
      className={clsx(classes.truncate, classes.badge, classes.defaultBadge, {
        [classes.activeDefault]: isActive && !data?.isLocal,
        [classes.activeLocal]: isActive && data?.isLocal,
        [classes.activePrivate]: isActive && id === data?._id && data?.isPrivate,
        [classes.defaultPrivate]: !isActive && id === data?._id && data?.isPrivate,
        [classes.defaultNotPrivate]: !isActive && !data?.isPrivate,
      })}
    >
      {isLoading && <CircularProgress size={10} color="inherit" style={{ marginRight: '5px' }} />}
      {!!errorMsg && errorMsg}
      {isLoaded && data?.title}
    </li>
  )
}

const areEqual = (pp: any, np: any) => pp.id === np.id

export const Badge = memo(Badge0, areEqual)

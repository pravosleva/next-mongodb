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

  const handleClick = useCallback(
    (id: string) => {
      console.log(isFoundAsLocal)
      console.log(data)
      if (isFoundAsLocal && !!data) {
        handleSetAsActiveNote({ ...data, _id: data.id, isLocal: true })
        return
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

        httpClient
          .getNote(id)
          .then((data) => {
            handleSetAsActiveNote(data)
          })
          .catch((err) => {
            addDangerNotif({
              title: 'Error',
              message: typeof err === 'string' ? err : err.message || 'No err.message',
            })
          })
      }
    },
    [JSON.stringify(state.notes), state.activeNote, handleSetAsActiveNote]
  )

  useEffect(() => {
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

        // NOTE: 1. Попробовать найти в LS
        try {
          // NOTE: Если да, то setData()
          const targetNote = localNotes.find(({ id: __id }) => __id === id)

          // eslint-disable-next-line no-console
          console.log(targetNote)

          if (!!targetNote) {
            setData(targetNote)
            setIsFoundAsLocal(true)
            setIsLoaded(true)
            setErrorMsg(null)
          }
        } catch (err) {
          // NOTE: Если нет, можно пока оставить
          // TODO: Можно открепить?
          // if (errorMsg === 'Request failed with status code 400') {}
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isLogged, isFoundAsLocal])

  return (
    <li
      onClick={() => handleClick(id)}
      className={clsx(classes.truncate, classes.badge, classes.defaultBadge, {
        [classes.activeDefault]: isActive,
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

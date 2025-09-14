/* eslint-disable no-console */
import ChipInput from 'material-ui-chip-input'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ELSFields } from '~/common/context/GlobalAppContext/interfaces'
import { useGlobalAppContext, useNotifsContext } from '~/common/hooks'
import buildUrl from 'build-url'
import { useRouter } from 'next/router'
import { httpClient } from '~/utils/httpClient'
import { useStyles } from './styles'
import clsx from 'clsx'

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT || ''

export const SubscribeTags = () => {
  const [chips, setChips] = useState<string[]>([])
  const { getFieldFromLS, setFieldToLS } = useGlobalAppContext()
  const renderSCountRef = useRef<number>(0)
  // @ts-ignore
  const [notes, setNotes] = useState<any[]>([])
  const router = useRouter()
  const { state, handleSetAsActiveNote } = useGlobalAppContext()
  const { addDangerNotif } = useNotifsContext()
  const { activeNote } = useMemo(() => state, [JSON.stringify(state)])
  const classes = useStyles()

  const handleClick = useCallback(
    (id: string) => {
      if (router.pathname !== '/') {
        router.push(`/notes/${id}`)
        return
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
    renderSCountRef.current += 1
    getFieldFromLS(ELSFields.SubscribedTags, true)
      .then((oldLSData) => {
        if (!Array.isArray(oldLSData)) throw new Error("WTF? oldData isn't an Array")
        setChips(oldLSData)
      })
      .catch((err) => {
        console.log(err)
        setFieldToLS(ELSFields.SubscribedTags, [], true)
          .then(() => {
            setChips([])
          })
          .catch((err) => {
            console.log(err)
          })
      })
  }, [])

  const handleAddChip = (chip: string) => {
    setChips((s) => [...new Set([...s, chip])])
  }
  const handleDeleteChip = (chip: string, _i: number) => {
    setChips((s) => s.filter((c) => c !== chip))
  }

  useEffect(() => {
    renderSCountRef.current += 1
    if (renderSCountRef.current <= 2) return
    setFieldToLS(ELSFields.SubscribedTags, chips, true)

    const fetchData = async () => {
      const queryParams: any = {
        limit: 100,
        // page: 1,
      }
      queryParams.q_titles = chips.join(',')
      const url = buildUrl(NEXT_APP_API_ENDPOINT, {
        path: '/notes',
        queryParams,
      })
      const res = await fetch(url, {
        // @ts-ignore
        // headers: getStandardHeadersByCtx(),
      })
      // setIsLoading(false)
      // @ts-ignore
      try {
        const {
          data,
          // pagination,
        } = await res.json()

        if (Array.isArray(data)) setNotes(data)
      } catch (err: any) {
        addDangerNotif({
          title: 'Error',
          message: typeof err === 'string' ? err : err.message || 'No err.message',
        })
      }
    }

    let _sendReqTimeout: any
    function startReq() {
      _sendReqTimeout = setTimeout(fetchData, 500)
    }
    function stopReq() {
      clearTimeout(_sendReqTimeout)
    }
    if (chips.length > 0) {
      startReq()
    } else {
      setNotes([])
    }

    return () => {
      if (!!_sendReqTimeout) stopReq()
    }
  }, [JSON.stringify(chips)])

  return (
    <>
      <h3>Subscribes{notes.length > 0 ? ` (${notes.length})` : ''}</h3>
      <div
        style={{
          marginBottom: '8px',
          width: '100%',
        }}
      >
        <ChipInput
          value={chips}
          onAdd={(chip) => handleAddChip(chip)}
          onDelete={(chip, index) => handleDeleteChip(chip, index)}
          fullWidth
          // variant="outlined"
          label="Tags"
          placeholder="Add tag here..."
          size="small"
        />
      </div>
      {notes.length > 0 && (
        <ul className={classes.list}>
          {notes.map((data: any) => {
            const { isPrivate, _id, title } = data
            const isActive = _id === activeNote?._id

            return (
              <li
                key={_id}
                onClick={() => handleClick(_id)}
                className={clsx(classes.truncate, classes.badge, classes.defaultBadge, {
                  [classes.activeDefault]: isActive,
                  [classes.activePrivate]: isActive && isPrivate,
                  [classes.defaultPrivate]: !isActive && isPrivate,
                  [classes.defaultNotPrivate]: !isActive && isPrivate,
                })}
              >
                {title}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

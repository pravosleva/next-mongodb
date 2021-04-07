import { useMemo, useCallback } from 'react'
import { useGlobalAppContext, useNotifsContext } from '~/common/hooks'
import { useStyles } from './styles'
// import clsx from 'clsx'
import { Badge } from './components/Badge'
import { httpClient } from '~/utils/httpClient'
import { useRouter } from 'next/router'

export const PinnedNotes = () => {
  const classes = useStyles()
  const { pinnedIds, state, handleSetAsActiveNote } = useGlobalAppContext()
  const { addDangerNotif } = useNotifsContext()
  const { activeNote } = useMemo(() => state, [JSON.stringify(state)])
  const router = useRouter()
  const handleClick = useCallback(
    (id: string) => {
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

  if (pinnedIds.length === 0) return <em>No pinned notes yet...</em>
  return (
    <ul className={classes.list} style={{ listStyleType: 'none' }}>
      {pinnedIds.map((id) => (
        <Badge
          isActive={id === activeNote?._id}
          key={id}
          id={id}
          style={{
            // color: activeNote?._id === id ? '#f44336' : 'inherit',
            cursor: 'pointer',
          }}
          onClick={() => {
            handleClick(id)
          }}
        />
      ))}
    </ul>
  )
}

import { useMemo } from 'react'
import { useGlobalAppContext } from '~/common/hooks'
import clsx from 'clsx'
import { useStyles } from './styles'
import Icon from '@mdi/react'
import { mdiPencil, mdiDelete } from '@mdi/js'

type TNote = {
  id: string
  title: string
  description: string
}
type TProps = {
  onEdit: (note: TNote) => void
  showEdit: boolean
  onSetAsActiveNote: (note: any) => void
}

export const Badge = ({ id, title, description, onEdit, showEdit, onSetAsActiveNote }: TNote & TProps) => {
  const classes = useStyles()
  const { removeLocalNote, state, handleResetActiveNote } = useGlobalAppContext()
  const { activeNote } = useMemo(() => state, [JSON.stringify(state)])
  const isActive = useMemo(() => id === activeNote?._id, [activeNote, id])

  return (
    <div
      className={clsx(classes.badge, classes.defaultBadge, {
        [classes.activeDefault]: isActive,
        // [classes.activePrivate]: isActive && id === data?._id && data?.isPrivate,
        // [classes.defaultPrivate]: !isActive && id === data?._id && data?.isPrivate,
        // [classes.defaultNotPrivate]: !isActive && !data?.isPrivate,
      })}
    >
      <div
        className={clsx(classes.truncate, classes.badgeContent)}
        onClick={() => {
          onSetAsActiveNote({ id, title, description, isLocal: true })
        }}
      >
        {title}
      </div>
      {showEdit && (
        <div
          className={classes.editButton}
          onClick={() => {
            onEdit({ id, title, description })
          }}
        >
          <Icon path={mdiPencil} size={0.7} />
        </div>
      )}
      <div
        className={classes.removeButton}
        onClick={() => {
          if (isActive) handleResetActiveNote()
          removeLocalNote(id)
        }}
      >
        <Icon path={mdiDelete} size={0.7} />
      </div>
    </div>
  )
}

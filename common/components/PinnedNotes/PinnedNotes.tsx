import { useMemo, useCallback } from 'react'
import { useGlobalAppContext, useNotifsContext } from '~/common/hooks'

export const PinnedNotes = () => {
  const { pinnedIds, state } = useGlobalAppContext()
  const { addDefaultNotif } = useNotifsContext()
  const { activeNote } = useMemo(() => state, [JSON.stringify(state)])
  const handleClick = useCallback((id: string) => {
    addDefaultNotif({
      title: 'TODO',
      message: (
        <ul style={{ paddingLeft: '10px' }}>
          <li>Get note by id: {id}</li>
          <li>Set as Active Note</li>
        </ul>
      ),
    })
  }, [])

  if (pinnedIds.length === 0) return <em>No pinned notes yet...</em>
  return (
    <div>
      <ul style={{ paddingLeft: '20px' }}>
        {pinnedIds.map((id) => (
          <li
            key={id}
            style={{
              color: activeNote?._id === id ? '#f44336' : 'inherit',
              cursor: 'pointer',
            }}
            onClick={() => {
              handleClick(id)
            }}
          >
            {id}
          </li>
        ))}
      </ul>
    </div>
  )
}

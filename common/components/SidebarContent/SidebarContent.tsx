import { PinnedNotes } from '~/common/components/PinnedNotes'
import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import { mdiTag, mdiPin } from '@mdi/js'

export const SidebarContent = () => {
  const { pinLimit, pinnedIds } = useGlobalAppContext()

  return (
    <div>
      <h3>
        Last {pinnedIds.length === pinLimit ? pinnedIds.length : `${pinnedIds.length} of ${pinLimit}`} pinned{' '}
        <MdiIcon path={mdiPin} size={0.7} />
      </h3>
      <PinnedNotes />

      <h3>
        Current tags <MdiIcon path={mdiTag} size={0.7} />
      </h3>
      <div>
        <em>In progress...</em>
      </div>
      <h4>Roadmap</h4>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Get all tags in current page</li>
        <li>Sort and memoizing</li>
        <li>Render btns & set as title search onClick</li>
      </ul>
    </div>
  )
}

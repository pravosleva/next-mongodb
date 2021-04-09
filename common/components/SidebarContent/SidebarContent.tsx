import { PinnedNotesNamespaceMap } from '~/common/components/PinnedNotesNamespaceMap'
// import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import {
  // mdiTag,
  mdiPin,
} from '@mdi/js'

export const SidebarContent = () => {
  return (
    <div>
      <h3>
        Pinned namespaces
        <MdiIcon path={mdiPin} size={0.7} />
      </h3>
      <PinnedNotesNamespaceMap />

      {/* <h3>
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
      </ul> */}
    </div>
  )
}

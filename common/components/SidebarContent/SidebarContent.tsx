import { PinnedNotes } from '~/common/components/PinnedNotes'
import { useGlobalAppContext } from '~/common/hooks'

export const SidebarContent = () => {
  const { pinLimit } = useGlobalAppContext()

  return (
    <div>
      <h3>Pinned ids</h3>
      <div>
        <em>In progress...</em>
      </div>
      <h4>Roadmap</h4>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Save to LS</li>
        <li>Read from LS</li>
        <li>Render btns & set as Active Note onClick</li>
      </ul>
      <h4>Last {pinLimit} pinned</h4>
      <PinnedNotes />
      <h3>Current tags</h3>
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

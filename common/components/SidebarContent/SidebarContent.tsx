import { PinnedNotesNamespaceMap } from '~/common/components/PinnedNotesNamespaceMap'
// import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import { mdiTag, mdiPin } from '@mdi/js'

export const SidebarContent = () => {
  return (
    <div>
      <h3>
        Pinned notes <MdiIcon path={mdiPin} size={0.7} />
      </h3>
      <PinnedNotesNamespaceMap />

      <h3>
        News by pinned tags <MdiIcon path={mdiTag} size={0.7} />
      </h3>
      <div>
        <em>In progress...</em>
      </div>
      <h4>Идея</h4>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Дать возможность пользователью прикрепить несколько тегов для отслеживания</li>
        <li>При добавлении тега в список, отображать здесь заметки по дате обновления</li>
      </ul>
    </div>
  )
}

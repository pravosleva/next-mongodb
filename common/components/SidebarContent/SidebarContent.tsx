import { PinnedNotesNamespaceMap } from '~/common/components/PinnedNotesNamespaceMap'
// import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import { mdiTag, mdiPin } from '@mdi/js'
import { useStyles } from './styles'

export const SidebarContent = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
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
        <li>
          Дать возможность пользователю прикрепить несколько <b>N1</b> тегов (лимит придется захардодить) для
          отслеживания;
        </li>
        <li>
          При добавлении тега в список, отображать здесь последние <b>N2</b> (аналогичный лимит) заметок,
          отфильтрованных по выбранным тегам;
        </li>
        <li>Собирать статистику по наиболее востребованным тегам?</li>
      </ul>
    </div>
  )
}

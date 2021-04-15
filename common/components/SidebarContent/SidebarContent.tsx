import { PinnedNotesNamespaceMap } from '~/common/components/PinnedNotesNamespaceMap'
// import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import { mdiPin } from '@mdi/js'
import { useStyles } from './styles'
import { CollabsibleContent } from '~/common/components/CollabsibleContent'

export const SidebarContent = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <h3>
        Pinned notes <MdiIcon path={mdiPin} size={0.7} />
      </h3>
      <PinnedNotesNamespaceMap />

      <h3>Планы</h3>
      <CollabsibleContent
        // activeTitleColor="#3882C4"
        // inactiveTitleColor="#a9a9a9"
        // isRightSide
        title="Подписка на теги"
        contentRenderer={(_collabsiblePs) => (
          <>
            <div style={{ marginBottom: '8px' }}>
              <em>Идея</em>
            </div>
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
          </>
        )}
      />
      <CollabsibleContent
        // activeTitleColor="#3882C4"
        // inactiveTitleColor="#a9a9a9"
        // isRightSide
        title="Local notes in LS"
        contentRenderer={(_collabsiblePs) => (
          <>
            <div style={{ marginBottom: '8px' }}>
              <em>Идея</em>
            </div>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Дать возможность пользователю создавать локальные заметки;</li>
              <li>
                Дать возможность переносить их на другие устройства с помощью QR кода, используя временное общее
                хранилище;
              </li>
              <li>Удалять из временного хранилища после переноса;</li>
            </ul>
          </>
        )}
      />
    </div>
  )
}

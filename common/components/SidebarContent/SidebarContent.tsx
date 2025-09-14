import { PinnedNotesNamespaceMap } from '~/common/components/PinnedNotesNamespaceMap'
import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import { mdiPin } from '@mdi/js'
import { useStyles } from './styles'
import { CollabsibleContent } from '~/common/components/CollabsibleContent'
import { LocalNotes } from '~/common/components/LocalNotes'
import { getLSSpace } from '~/utils/getLSSpace'
import { ELSFields } from '~/common/context'
import { SubscribeTags } from '~/common/components/SubscribeTags'

export const SidebarContent = () => {
  const classes = useStyles()
  const { localNotes } = useGlobalAppContext()

  return (
    <div className={classes.wrapper}>
      <h3>
        Pinned notes <MdiIcon path={mdiPin} size={0.7} />
      </h3>
      <PinnedNotesNamespaceMap />
      <CollabsibleContent
        // activeTitleColor="#3882C4"
        // inactiveTitleColor="#a9a9a9"
        // isRightSide
        title={`Local notes (${!!localNotes && Array.isArray(localNotes) ? localNotes.length : 0})${
          localNotes?.length > 0 ? ` | ${getLSSpace(2, ELSFields.LocalNotes)} in LS` : ''
        }`}
        contentRenderer={(_collabsiblePs) => (
          <>
            <LocalNotes />
            {/*
            <CollabsibleContent
              activeTitleColor="#3882C4"
              inactiveTitleColor="#a9a9a9"
              isRightSide
              title="Roadmap"
              contentRenderer={(_collabsiblePs) => (
                <ul style={{ paddingLeft: '20px' }}>
                  <li>✔ Ability to create Local Notes;</li>
                  <li>✔ Local notes integration to Namespaces;</li>
                  <li>☐ Возможность поиска по локальным заметкам;</li>
                  <li>
                    ✔ Дать возможность переносить их на другие устройства с помощью QR кода, используя временное облако;
                    <ul style={{ paddingLeft: '10px' }}>
                      <li>✔ Сохранить в облаке;</li>
                      <li>
                        ✔ Page <b>/crossdevice/set-local-notes</b>
                        <ul style={{ paddingLeft: '10px' }}>
                          <li>
                            ✔ Get lsData on SSR by reqId (req.query.payload)
                            <ul style={{ paddingLeft: '10px' }}>
                              <li>✔ Удалять из облака после переноса;</li>
                            </ul>
                          </li>

                          <li>✔ Add to ls (filtered by unique id)</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    ☐ <b>Better UI</b> (add new Local note form in modal);
                  </li>
                  <li>☐ CRON для ежедневной чистки памяти временного хранилища;</li>
                  <li>☐ Реал-тайм мониторинг ресурсов;</li>
                  <li>
                    ✔ Page <b>/local-note/:id</b>;
                  </li>
                </ul>
              )}
            />
            */}
          </>
        )}
      />

      {/* <h3>Планы</h3>
      <CollabsibleContent
        // activeTitleColor="#3882C4"
        // inactiveTitleColor="#a9a9a9"
        // isRightSide
        title="Подписка на теги"
        contentRenderer={(_collabsiblePs) => (
          <>
            <div>Дать возможность пользователю прикрепить теги для отслеживания новых заметок, их содержащих</div>
            <CollabsibleContent
              activeTitleColor="#3882C4"
              inactiveTitleColor="#a9a9a9"
              isRightSide
              title="Roadmap"
              contentRenderer={(_collabsiblePs) => (
                <ul style={{ paddingLeft: '20px' }}>
                  <li>✔ Возможность прикрепить теги</li>
                  <li>
                    ✔ При добавлении тега в список, отображать здесь последние <b>N</b> (например, запрашиваемый лимит
                    по всем фильтрам =50) заметок, отфильтрованных по выбранным тегам;
                  </li>
                  <li>✔ search</li>
                  <li>☐ display</li>
                </ul>
              )}
            />
          </>
        )}
      /> */}
      <SubscribeTags />
    </div>
  )
}

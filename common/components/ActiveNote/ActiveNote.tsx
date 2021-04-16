/* eslint-disable no-console */
import { useMemo, useCallback } from 'react'
// import { openLinkInNewTab } from '~/utils/openLinkInNewTab'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Rating } from 'semantic-ui-react'
import { useFreshNote } from '~/common/hooks'
// import { Scrollbars } from 'react-custom-scrollbars'
// import { useWindowSize } from '~/hooks'
import { baseRenderers } from '~/common/react-markdown-renderers'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import clsx from 'clsx'
import Button from '@material-ui/core/Button'
import { useAuthContext, useGlobalAppContext } from '~/common/hooks'
import { useStyles } from './styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import EditIcon from '@material-ui/icons/Edit'
import { useRouter } from 'next/router'
import { Tags } from '~/common/components/Tags'
import MdiIcon from '@mdi/react'
import {
  // mdiPin,
  mdiPinOff,
} from '@mdi/js'
import { PinNote } from '~/common/components/PinNote'
import { ELSFields } from '~/common/context/GlobalAppContext'

interface IProps {
  note: any
  descriptionRenderer?: React.FC<any>
  isTagsNessesary?: boolean
  shouldTitleBeTruncated?: boolean
}

const MyComponent = ({ note: initialNote, descriptionRenderer, isTagsNessesary, shouldTitleBeTruncated }: IProps) => {
  const baseClasses = useBaseStyles()
  const classes = useStyles()
  const freshNote = useFreshNote(initialNote)
  const { description, priority, title, _id, isPrivate } = freshNote || {
    description: null,
    priority: 0,
    title: null,
    _id: null,
    isPrivate: true,
  }
  const router = useRouter()
  const { isLogged } = useAuthContext()
  const { pinnedMap, handleUnpinFromLS } = useGlobalAppContext()
  const isIdPinned = useCallback(
    (id) => {
      if (!pinnedMap) return false
      let result

      // @ts-ignore
      for (const ns in pinnedMap) {
        // @ts-ignore
        const ids = pinnedMap[ns].ids
        if (!ids) result = false
        if (ids.includes(id)) result = true
      }

      return result
    },
    [JSON.stringify(pinnedMap)]
  )
  const isPinned = useMemo(() => isIdPinned(_id), [_id, isIdPinned])

  return (
    <div className={clsx('todo-item', baseClasses.customizableListingWrapper, { 'todo-item_private': isPrivate })}>
      <div style={{ marginBottom: '0px', userSelect: 'none' }}>
        <h2 className={clsx({ [classes.truncate]: shouldTitleBeTruncated })}>{title}</h2>
      </div>
      {!!_id && (
        <div
          style={{
            userSelect: 'none',
            // border: '1px solid transparent',
            minHeight: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottom: '1px solid lightgray',
          }}
        >
          <Rating key={priority} maxRating={5} rating={priority} disabled />
        </div>
      )}
      {!!description &&
        (!!descriptionRenderer ? (
          descriptionRenderer({ description })
        ) : (
          /*
          <Scrollbars
            autoHeight
            autoHeightMin={500}
            // autoHeightMax={!!height ? (height || 0) - 180 : 200}
            // This will activate auto hide
            autoHide
            // Hide delay in ms
            // autoHideTimeout={1000}
            // Duration for hide animation in ms.
            // autoHideDuration={500}
          >
          */
          <div className="description-markdown">
            {/* @ts-ignore */}
            <ReactMarkdown plugins={[gfm, { singleTilde: false }]} renderers={baseRenderers} children={description} />
          </div>
        ))}
      {/* <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(note, null, 2)}</pre> */}

      {!!_id && isTagsNessesary && !initialNote?.isLocal && (
        <>
          <div style={{ borderBottom: '1px solid lightgray' }} />
          <div className={clsx(baseClasses.actionsBoxLeft, baseClasses.standardCardFooter)}>
            <Button
              // disabled={isNotesLoading}
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                router.push(`/notes/${_id}`)
              }}
              startIcon={<ArrowForwardIcon />}
            >
              View
            </Button>
            {isLogged && (
              <Button
                // disabled={isNotesLoading}
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => {
                  router.push(`/notes/${_id}/edit`)
                }}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            )}

            {!isPinned ? (
              <PinNote id={_id} />
            ) : (
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => {
                  handleUnpinFromLS(_id, ELSFields.MainPinnedNamespaceMap)
                }}
                startIcon={<MdiIcon path={mdiPinOff} size={0.7} />}
                disabled={!isPinned}
              >
                Unpin
              </Button>
            )}

            <Tags title={title} />
          </div>
        </>
      )}
    </div>
  )
}

// function areEqual(prevProps: any, nextProps: any) {
//   // NOTE: return true, if render unnecessary
//   return (
//     (!!prevProps.note?._id && !nextProps.note?._id) ||
//     (prevProps.note._id === nextProps.note._id && prevProps.note.updatedAt === nextProps.note.updatedAt)
//   )
// }
// export const ActiveNote = memo(MyComponent, areEqual)
export const ActiveNote = MyComponent

/* eslint-disable no-console */
import { useMemo, memo, useState, useCallback } from 'react'
// import { openLinkInNewTab } from '~/utils/openLinkInNewTab'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Rating } from 'semantic-ui-react'
import { useFreshNote, useWindowSize } from '~/common/hooks'
// import { Scrollbars } from 'react-custom-scrollbars'
import { CodeRendererSynthwave84, baseRenderers } from '~/common/react-markdown-renderers'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import clsx from 'clsx'
import { Button } from '@material-ui/core'
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
  mdiTools,
  mdiChevronDown,
  mdiChevronUp,
} from '@mdi/js'
import { PinNote } from '~/common/components/PinNote'
import { ELSFields } from '~/common/context/GlobalAppContext'
import { getNormalizedDateTime3 } from '~/utils/timeConverter'

const MainSpace = memo(({ description }: { description: string }) => {
  return (
    <div className="description-markdown">
      {/* @ts-ignore */}
      <ReactMarkdown plugins={[gfm, { singleTilde: false }]} renderers={baseRenderers} children={description} />
    </div>
  )
})

interface IProps {
  note: any
  descriptionRenderer?: React.FC<any>
  isTagsNessesary?: boolean
  shouldTitleBeTruncated?: boolean
  noHeader?: boolean
}

const MyComponent = ({
  noHeader,
  note: initialNote,
  descriptionRenderer,
  isTagsNessesary,
  shouldTitleBeTruncated,
}: IProps) => {
  const baseClasses = useBaseStyles()
  const classes = useStyles()
  const freshNote = useFreshNote(initialNote)
  const isLocal = useMemo(() => !!initialNote?.isLocal, [initialNote])
  const { description, priority, title, _id, isPrivate } = freshNote || {
    description: null,
    priority: 0,
    title: null,
    _id: null,
    isPrivate: true,
  }
  const router = useRouter()
  const { isLogged } = useAuthContext()
  const { handleUnpinFromLS, isIdPinned } = useGlobalAppContext()
  const isPinned = useMemo(() => isIdPinned(_id), [_id, isIdPinned])
  const { isMobile, isDesktop } = useWindowSize() // upMd, upLg, upXl, downMd, downLg, downXl

  const createTimeNormalized = useMemo<string | null>(
    () => (!!freshNote ? getNormalizedDateTime3(new Date(freshNote.createdAt).getTime()) : null),
    [freshNote?.createdAt]
  )
  const updateTimeNormalized = useMemo<string | null>(
    () => (!!freshNote ? getNormalizedDateTime3(new Date(freshNote.updatedAt).getTime()) : null),
    [freshNote?.updatedAt]
  )

  const [isServiceInfoOpened, setIsServiceInfoOpened] = useState<boolean>(false)
  const handleToggleServiceInfo = useCallback(() => {
    setIsServiceInfoOpened((s) => !s)
  }, [])

  return (
    <div
      className={clsx('todo-item', baseClasses.customizableListingWrapper, {
        'todo-item_private': isPrivate,
        'todo-item_local': isLocal,
        // 'full-height': true,
      })}
      style={{
        minHeight: isMobile ? '100%' : 'auto',
      }}
    >
      {!noHeader && (
        <div style={{ marginBottom: '0px', userSelect: 'none' }}>
          <h2 className={clsx({ [classes.truncate]: shouldTitleBeTruncated })}>{title}</h2>
        </div>
      )}
      {!!freshNote && !!_id && !noHeader && (
        <div
          style={{
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid lightgray',
          }}
        >
          <div
            style={{
              // border: '1px solid transparent',
              minHeight: '30px',
              // height: '50px',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              textShadow: 'none',
            }}
          >
            <Rating key={priority} maxRating={5} rating={priority} disabled />
          </div>
          <div className={classes.timeSectionWrapper}>
            <div>Crd: {createTimeNormalized || typeof createTimeNormalized}</div>
            {isDesktop && (
              <Button
                variant="text"
                size="small"
                color="primary"
                onClick={handleToggleServiceInfo}
                // startIcon={<MdiIcon path={mdiPinOff} size={0.7} />}
                startIcon={<MdiIcon path={mdiTools} size={0.7} />}
                endIcon={<MdiIcon path={isServiceInfoOpened ? mdiChevronUp : mdiChevronDown} size={0.7} />}
                // disabled={!isPinned}
              >
                Tools
              </Button>
            )}
            <div>Upd: {updateTimeNormalized || typeof updateTimeNormalized}</div>
          </div>
        </div>
      )}
      {!!description &&
        (!!descriptionRenderer ? descriptionRenderer({ description }) : <MainSpace description={description} />)}
      {isServiceInfoOpened && (
        <div className={classes.serviceCodeSectionWrapper}>
          <CodeRendererSynthwave84 language="json" value={JSON.stringify(freshNote, null, 2)} />
        </div>
      )}
      {!!_id && isTagsNessesary && (
        <>
          <div style={{ borderBottom: '1px solid lightgray', padding: '0px' }} />
          <div className={clsx(baseClasses.actionsBoxLeft, baseClasses.standardCardFooter)}>
            {!initialNote?.isLocal ? (
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
            ) : (
              <Button
                // disabled={isNotesLoading}
                variant="contained"
                size="small"
                color="secondary"
                onClick={() => {
                  router.push(`/local-notes/${_id}`)
                }}
                startIcon={<ArrowForwardIcon />}
              >
                View
              </Button>
            )}
            {isLogged && !initialNote?.isLocal && (
              <Button
                // disabled={isNotesLoading}
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => {
                  router.push(`/notes/${_id}/edit`)
                }}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            )}

            {!isPinned ? (
              <PinNote id={_id} isLocal={initialNote?.isLocal} />
            ) : (
              <Button
                variant="outlined"
                size="small"
                color={initialNote?.isLocal ? 'secondary' : 'primary'}
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
export const ActiveNote = memo(MyComponent)

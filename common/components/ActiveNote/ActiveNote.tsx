/* eslint-disable no-console */
import { memo } from 'react'
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
import { useAuthContext } from '~/common/hooks'
import { useStyles } from './styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import EditIcon from '@material-ui/icons/Edit'
import { useRouter } from 'next/router'
import { Tags } from '~/common/components/Tags'

interface IProps {
  note: any
  descriptionRenderer?: React.FC<any>
  isTagsNessesary?: boolean
  shouldTitleBeTruncated?: boolean
}

const MyComponent = ({ note: initialNote, descriptionRenderer, isTagsNessesary, shouldTitleBeTruncated }: IProps) => {
  const baseClasses = useBaseStyles()
  const classes = useStyles()
  const { description, priority, title, _id, isPrivate } = useFreshNote(initialNote)
  const router = useRouter()
  const { isLogged } = useAuthContext()

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

      {!!_id && isTagsNessesary && (
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
            <Tags title={title} />
          </div>
        </>
      )}
    </div>
  )
}

function areEqual(prevProps: any, nextProps: any) {
  // NOTE: return true, if render unnecessary
  return (
    (!!prevProps.note?._id && !nextProps.note?._id) ||
    (prevProps.note._id === nextProps.note._id && prevProps.note.updatedAt === nextProps.note.updatedAt)
  )
}
export const ActiveNote = memo(MyComponent, areEqual)

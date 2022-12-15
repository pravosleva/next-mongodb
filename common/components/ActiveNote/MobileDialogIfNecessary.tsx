import { forwardRef, useMemo, useCallback, useRef } from 'react'
import {
  Button as MuiButton,
  ButtonGroup as MuiButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import Slide from '@material-ui/core/Slide'
import { useFreshNote, useGlobalAppContext, useWindowSize } from '~/common/hooks'
import { ActiveNote } from './ActiveNote'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { dialogRenderers } from '~/common/react-markdown-renderers'
import clsx from 'clsx'
import { useStyles } from './styles'
// @ts-ignore
import { animateScroll } from 'react-scroll'
import Icon from '@mdi/react'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'

const TransitionUp = forwardRef(function Transition(props, ref) {
  // @ts-ignore
  return <Slide direction="up" ref={ref} {...props} />
})

export const MobileDialogIfNecessary = () => {
  const { state, handleResetActiveNote } = useGlobalAppContext()
  const { isMobile } = useWindowSize()
  const activeNote = useMemo(() => state.activeNote, [state.activeNote?._id])
  const freshNote = useFreshNote(activeNote)
  // useEffect(() => { console.log(freshNote?._id) }, [freshNote?._id])
  const isOpened = useMemo(() => !!freshNote?._id, [freshNote?._id])
  const handleCloseModal = useCallback(() => {
    handleResetActiveNote()
  }, [handleResetActiveNote])
  const classes = useStyles()
  const containerRef = useRef<any>(null)

  if (!isMobile) return null
  return (
    <Dialog
      open={isOpened}
      onClose={handleCloseModal}
      // scroll="paper"
      aria-labelledby={`scroll-dialog-title-activeNote-mobile_${freshNote?._id}`}
      // fullWidth
      fullScreen
      // maxWidth="lg"
      // @ts-ignore
      TransitionComponent={TransitionUp}
    >
      <DialogTitle
        id={`scroll-dialog-title-activeNote-mobile_${freshNote?._id}`}
        className={clsx({ [classes.truncate]: true })}
      >
        {freshNote?.title}
      </DialogTitle>
      <DialogContent
        ref={containerRef}
        dividers={true}
        // className={classes.dialogMDContent}
        style={{
          padding: '0px',
          // borderTop: 'none',
        }}
        id="dialog-content"
      >
        <ActiveNote
          noHeader
          // key={state.activeNote?.id}
          note={state.activeNote}
          isTagsNessesary
          descriptionRenderer={({ description }) => {
            return (
              <div className="description-markdown" style={{ marginTop: '16px' }}>
                <ReactMarkdown
                  // @ts-ignore
                  plugins={[gfm, { singleTilde: false }]}
                  renderers={dialogRenderers}
                  children={description}
                />
              </div>
            )
          }}
        />
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'space-between',
        }}
      >
        <MuiButtonGroup>
          <MuiButton
            color="default"
            size="large"
            variant="outlined"
            onClick={() => {
              if (!!containerRef.current) {
                // containerRef.current.scrollIntoView(false)
                animateScroll.scrollToBottom({
                  containerId: 'dialog-content',
                })
              }
            }}
            // startIcon={<Icon path={mdiArrowDown} size={0.7} />}
          >
            <Icon path={mdiArrowDown} size={0.7} />
          </MuiButton>
          <MuiButton
            color="default"
            size="large"
            variant="outlined"
            onClick={() => {
              if (!!containerRef.current) {
                // containerRef.current.scrollIntoView(false)
                animateScroll.scrollToTop({
                  containerId: 'dialog-content',
                })
              }
            }}
            // startIcon={<Icon path={mdiArrowDown} size={0.7} />}
          >
            <Icon path={mdiArrowUp} size={0.7} />
          </MuiButton>
        </MuiButtonGroup>
        <MuiButton
          color="primary"
          size="large"
          variant="outlined"
          onClick={handleCloseModal}
          // endIcon={<EditIcon />}
        >
          Close
        </MuiButton>
      </DialogActions>
    </Dialog>
  )
}

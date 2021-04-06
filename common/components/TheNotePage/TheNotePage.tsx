import fetch from 'isomorphic-unfetch'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Confirm, Loader } from 'semantic-ui-react'
// import { Button as MuiButton } from '@material-ui/core'
import { ActiveNote } from '~/common/components/ActiveNote'
import { useAuthContext } from '~/common/context'
// See also: https://github.com/hadnazzar/nextjs-with-material-ui/blob/master/pages/about.js
import { Box, Button } from '@material-ui/core'
// import Button from '@material-ui/core/Button'
// import { useStyles } from './styles'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/common/react-markdown-renderers'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { ThemedButton } from '~/common/styled-mui/custom-button'
import clsx from 'clsx'
// import ZoomInIcon from '@material-ui/icons/ZoomIn'
// import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import { useWindowSize, useNotifsContext } from '~/common/hooks'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { Alert, EType as EAlertType } from '~/common/react-markdown-renderers/Alert'

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT

export const TheNotePage = ({ initNote: note }: any) => {
  const [confirm, setConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  // const note = useMemo(() => initNote, [JSON.stringify(initNote)])
  const baseClasses = useBaseStyles()

  useEffect(() => {
    if (isDeleting) deleteNote()
  }, [isDeleting])

  const handleOpen = () => {
    setConfirm(true)
  }
  const handleClose = () => setConfirm(false)
  const deleteNote = async () => {
    const noteId = router.query.id
    try {
      await fetch(`${NEXT_APP_API_ENDPOINT}/notes/${noteId}`, {
        method: 'Delete',
      })

      router.push('/')
    } catch (_err) {
      // console.log(error)
      // TODO: logger
    }
  }
  const handleEdit = () => {
    const noteId = router.query.id

    router.push(`/notes/${noteId}/edit`)
  }
  const handleDelete = async () => {
    setIsDeleting(true)
    handleClose()
  }
  const { isLogged } = useAuthContext()
  // const [isFullWidthContent, setIsFullWidthContent] = useState(false)
  // const handleSetFullWidth = () => {
  //   setIsFullWidthContent(true)
  // }
  // const handleSetMinWidth = () => {
  //   setIsFullWidthContent(false)
  // }
  const { isDesktop } = useWindowSize()
  const { addDangerNotif } = useNotifsContext()
  const copyLinkToClipboard = () => {
    try {
      const noteId = router.query.id

      navigator.clipboard.writeText(`http://code-samples.space/notes/${noteId}`)
    } catch (err) {
      // eslint-disable-next-line no-console
      // console.log(err)
      addDangerNotif({
        title: 'Error',
        message: typeof err === 'string' ? err : err?.message || 'No err.message',
      })
    }
  }
  const MemoizedBtnsBox = useMemo(
    () => (
      <div style={{ margin: '0 auto' }}>
        <Box my={4} className={clsx(baseClasses.standardMobileResponsiveBlock, baseClasses.btnsBox)}>
          {isLogged && !isDeleting && (
            <>
              <ThemedButton color="red" onClick={handleOpen} endIcon={<DeleteIcon />}>
                Delete
              </ThemedButton>
              <Button color="default" variant="contained" onClick={handleEdit} endIcon={<EditIcon />}>
                Edit
              </Button>
            </>
          )}
          {/* isDesktop && (
            <>
              {!isFullWidthContent ? (
                <ThemedButton color="blue" onClick={handleSetFullWidth} endIcon={<ZoomInIcon />}>
                  Full width
                </ThemedButton>
              ) : (
                <ThemedButton color="blue" onClick={handleSetMinWidth} endIcon={<ZoomOutIcon />}>
                  Min width
                </ThemedButton>
              )}
            </>
          )*/}

          <ThemedButton color="blue" onClick={copyLinkToClipboard} endIcon={<FileCopyIcon />}>
            Copy Link
          </ThemedButton>

          {/* <MuiButton color="default" variant="outlined" onClick={handleEdit}>
          Edit
        </MuiButton>
        <MuiButton color="secondary" variant="outlined" onClick={handleEdit}>
          Edit
        </MuiButton> */}
        </Box>
      </div>
    ),
    [handleOpen, handleEdit, isLogged, isDeleting, isDesktop]
  )

  if (!note)
    return (
      <>
        <h1>Oops...</h1>
        <Alert text="Check access" header="Sorry" type={EAlertType.warning} />
      </>
    )

  return (
    <div className={baseClasses.noPaddingMobile}>
      {MemoizedBtnsBox}
      <Box my={4} className={baseClasses.noMarginTopBottomMobile}>
        {isDeleting ? (
          <Loader active />
        ) : (
          <div
            style={{
              // maxWidth: isFullWidthContent ? '100%' : '700px',
              maxWidth: '700px',
              transition: 'all 0.3s linear',
            }}
          >
            {!!note && (
              <ActiveNote
                note={note}
                descriptionRenderer={({ description }) => {
                  return (
                    <div className="description-markdown">
                      <ReactMarkdown
                        // @ts-ignore
                        plugins={[gfm, { singleTilde: false }]}
                        renderers={theNotePageRenderers}
                        children={description}
                      />
                    </div>
                  )
                }}
              />
            )}
          </div>
        )}
        <Confirm open={confirm} onCancel={handleClose} onConfirm={handleDelete} />
      </Box>
      {MemoizedBtnsBox}
    </div>
  )
}

import fetch from 'isomorphic-unfetch'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Confirm, Loader } from 'semantic-ui-react'
// import { Button as MuiButton } from '@material-ui/core'
import { ActiveNote } from '~/common/components/ActiveNote'
import { useAuthContext } from '~/common/context'
// See also: https://github.com/hadnazzar/nextjs-with-material-ui/blob/master/pages/about.js
import { Button } from '@material-ui/core'
// import Button from '@material-ui/core/Button'
// import { useStyles } from './styles'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/common/react-markdown-renderers'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import clsx from 'clsx'
// import ZoomInIcon from '@material-ui/icons/ZoomIn'
// import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import { useWindowSize, useNotifsContext, useGlobalAppContext } from '~/common/hooks'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { Alert, EType as EAlertType } from '~/common/react-markdown-renderers/Alert'
import { PinNote } from '~/common/components/PinNote'
import MdiIcon from '@mdi/react'
import {
  // mdiPin,
  mdiPinOff,
} from '@mdi/js'
import { ELSFields } from '~/common/context/GlobalAppContext'

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
  const noteId = useMemo(() => router.query.id, [router.query.id])
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
  const isPinned = useMemo(() => isIdPinned(noteId), [noteId, isIdPinned])
  const handleEdit = useCallback(() => {
    router.push(`/notes/${noteId}/edit`)
  }, [noteId])
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
  const { isDesktop, isMobile } = useWindowSize()
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
        <div
          style={
            {
              // padding: '8px 8px 16px 8px',
            }
          }
          className={clsx(baseClasses.standardMobileResponsiveBlock, baseClasses.btnsBox)}
        >
          {isLogged && !isDeleting && !note?.isLocal && (
            <>
              <ThemedButton size="small" color={EColorValue.red} onClick={handleOpen} endIcon={<DeleteIcon />}>
                Delete
              </ThemedButton>
              <Button size="small" color="primary" variant="outlined" onClick={handleEdit} endIcon={<EditIcon />}>
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

          {!isPinned && !!noteId && typeof noteId === 'string' ? (
            <PinNote id={noteId} />
          ) : (
            <Button
              variant="outlined"
              size="small"
              color={note.isLocal ? 'secondary' : 'primary'}
              onClick={() => {
                if (typeof noteId === 'string') handleUnpinFromLS(noteId, ELSFields.MainPinnedNamespaceMap)
                // TODO: Notif
              }}
              endIcon={<MdiIcon path={mdiPinOff} size={0.7} />}
              disabled={!isPinned}
            >
              Unpin
            </Button>
          )}

          <ThemedButton size="small" color={EColorValue.blue} onClick={copyLinkToClipboard} endIcon={<FileCopyIcon />}>
            Copy Link
          </ThemedButton>

          {/* <MuiButton color="default" variant="outlined" onClick={handleEdit}>
          Edit
        </MuiButton>
        <MuiButton color="secondary" variant="outlined" onClick={handleEdit}>
          Edit
        </MuiButton> */}
        </div>
      </div>
    ),
    [handleOpen, handleEdit, isLogged, isDeleting, isDesktop]
  )

  if (!note)
    return (
      <>
        <h1>Oops...</h1>
        <div style={{ padding: isMobile ? '0px 8px 0px 8px' : '0px' }}>
          <Alert text="Check access" header="Sorry" type={EAlertType.warning} />
        </div>
      </>
    )

  return (
    <div className={baseClasses.noPaddingMobile}>
      {MemoizedBtnsBox}
      <div className={baseClasses.noMarginTopBottomMobile}>
        {isDeleting ? (
          <Loader active />
        ) : (
          <div
            style={{
              // maxWidth: isFullWidthContent ? '100%' : '700px',
              // maxWidth: '700px',
              width: '100%',
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
      </div>
      {MemoizedBtnsBox}
    </div>
  )
}

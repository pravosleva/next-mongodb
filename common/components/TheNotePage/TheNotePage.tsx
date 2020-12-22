import fetch from 'isomorphic-unfetch'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Confirm, Button, Loader } from 'semantic-ui-react'
import { ActiveNote } from '~/common/components/ActiveNote'
import { useAuthContext } from '~/common/context'
import Container from '@material-ui/core/Container'
// See also: https://github.com/hadnazzar/nextjs-with-material-ui/blob/master/pages/about.js
import Box from '@material-ui/core/Box'
// import Button from '@material-ui/core/Button'
// import { useStyles } from './styles'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { CodeRendererMaterialDark, ImageRenderer, HeadingRenderer } from '~/common/react-markdown-renderers'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'

const renderers = {
  code: CodeRendererMaterialDark,
  image: ImageRenderer,
  heading: HeadingRenderer,
}

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT

export const TheNotePage = ({ initNote: note }: any) => {
  const [confirm, setConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  // const note = useMemo(() => initNote, [JSON.stringify(initNote)])
  const baseClasses = useBaseStyles()

  useEffect(() => {
    if (isDeleting) {
      deleteNote()
    }
  }, [isDeleting])

  const handleOpen = () => setConfirm(true)
  const handleClose = () => setConfirm(false)
  const deleteNote = async () => {
    const noteId = router.query.id
    try {
      await fetch(`${NEXT_APP_API_ENDPOINT}/api/notes/${noteId}`, {
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
  const MemoizedBtnsBox = useMemo(
    () => (
      <Box my={4} className={baseClasses.btnsBox}>
        <Button basic color="red" onClick={handleOpen}>
          Delete
        </Button>
        <Button basic color="blue" onClick={handleEdit}>
          Edit
        </Button>
      </Box>
    ),
    [isLogged, handleOpen, handleEdit]
  )

  return (
    <Container maxWidth="md" className={baseClasses.noPaddingMobile}>
      {isLogged && MemoizedBtnsBox}
      <Box my={4} className={baseClasses.noMarginTopBottomMobile}>
        {isDeleting ? (
          <Loader active />
        ) : (
          <div>
            {!!note && (
              <ActiveNote
                note={note}
                descriptionRenderer={({ description }) => {
                  return (
                    <div className="description-markdown">
                      <ReactMarkdown
                        // @ts-ignore
                        plugins={[gfm, { singleTilde: false }]}
                        renderers={renderers}
                        children={description}
                      />
                    </div>
                  )
                }}
              />
            )}
          </div>
        )}
        <Confirm handleOpen={confirm} onCancel={handleClose} onConfirm={handleDelete} />
      </Box>
      {isLogged && MemoizedBtnsBox}
    </Container>
  )
}
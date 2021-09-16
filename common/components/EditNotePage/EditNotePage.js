import { useState, useEffect, useMemo } from 'react'
import fetch from 'isomorphic-unfetch'
import { Form, Loader } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import MarkdownIt from 'markdown-it'
import loadable from '@loadable/component'
import { useAuthContext } from '~/common/context'
import { Rating } from 'semantic-ui-react'
import Container from '@material-ui/core/Container'
// See also: https://github.com/hadnazzar/nextjs-with-material-ui/blob/master/pages/about.js
import Box from '@material-ui/core/Box'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import { FormGroup, Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Checkbox } from '@material-ui/core'
import { ThemedButton } from '~/common/styled-mui/custom-button'
import clsx from 'clsx'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
// import MDEditor from 'react-markdown-editor-lite'

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT
const mdParser = new MarkdownIt({
  html: false,
  langPrefix: 'language-',
})

const MDEditor = loadable(() => import('react-markdown-editor-lite')) // Ленивая загрузка

export const EditNotePage = withWidth()(({ note, width }) => {
  const [form, setForm] = useState({
    title: note.title,
    description: note.description,
    priority: note.priority || 0,
    isPrivate: note.isPrivate || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const { isLogged } = useAuthContext()
  const baseClasses = useBaseStyles()

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        updateNote()
      } else {
        setIsSubmitting(false)
      }
    }
  }, [errors, isSubmitting])

  const updateNote = async () => {
    try {
      const body = {}
      for (const key in form) {
        switch (key) {
          case 'title':
          case 'description':
          case 'isPrivate':
            body[key] = form[key]
            break
          case 'priority':
            if (!!form[key]) body[key] = form[key]
            break
          default:
            break
        }
      }
      const _res = await fetch(`${NEXT_APP_API_ENDPOINT}/notes/${router.query.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      router.push(`/notes/${router.query.id}`)
    } catch (_err) {
      // console.log(err)
      // TODO: logger
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errs = validate()
    setErrors(errs)
    setIsSubmitting(true)
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  const handleCheck = (e) => {
    e.persist()
    // eslint-disable-next-line no-console
    // console.log(e)
    setForm({
      ...form,
      [e.target.name]: e.target.checked,
    })
  }

  const handleSetRate = (e, { rating, maxRating }) => {
    handleChange({ target: { name: 'priority', value: rating } })
  }

  const validate = () => {
    let err = {}

    if (!form.title) {
      err.title = 'Title is required'
    }
    if (!form.description) {
      err.description = 'Description is required'
    }

    return err
  }
  const isDesktop = useMemo(() => width !== 'xs' && width !== 'sm', [width]) // useWindowSize()
  const minHeight = useMemo(() => (isDesktop ? '600px' : '300px'), [isDesktop])

  return (
    <div className={baseClasses.noPaddingMobile}>
      <Box
        px={isDesktop ? 0 : 1}
        my={4}
        // className={baseClasses.noMarginTopBottomMobile}
      >
        <h1>
          <span style={{ marginRight: '15px' }}>Edit</span>
          <Rating onRate={handleSetRate} maxRating={5} defaultRating={form.priority} disabled={isSubmitting} />
        </h1>
      </Box>

      {isSubmitting ? (
        <Loader active inline="centered" />
      ) : (
        <Form onSubmit={handleSubmit}>
          {isLogged && (
            <Box className={clsx(baseClasses.btnsBox)}>
              <ThemedButton type="submit" color="red" variant="contained">
                Update
              </ThemedButton>
            </Box>
          )}
          <Box
            px={isDesktop ? 0 : 1}
            style={{ marginBottom: '8px' }}
            className={baseClasses.standardMobileResponsiveBlock}
          >
            <TextField
              size="small"
              // label="Title"
              type="text"
              variant="outlined"
              fullWidth
              placeholder="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              autoComplete="off"
            />
          </Box>
          <Box px={isDesktop ? 0 : 1} className={baseClasses.standardMobileResponsiveBlock}>
            <MDEditor
              style={{
                boxShadow: '0px 0px 8px rgba(144, 164, 183, 0.6)',
                // border: '1px solid rgba(34,36,38,.15)',
                border: 'none',
                borderRadius: '8px',
                minHeight,
              }}
              value={form.description}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }) => {
                handleChange({ target: { value: text, name: 'description' } })
              }}
              config={{
                view: { menu: false, md: true, html: isDesktop },
                canView: {
                  menu: false,
                  md: true,
                  html: isDesktop,
                  fullScreen: true,
                  hideMenu: true,
                },
              }}
            />
          </Box>
          {isLogged && (
            <Box className={clsx(baseClasses.btnsBox)} style={{ marginBottom: isDesktop ? '0px' : '40px' }}>
              <ThemedButton type="submit" color="red" variant="contained">
                Update
              </ThemedButton>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={form.isPrivate} onChange={handleCheck} name="isPrivate" color="primary" />
                  }
                  label="isPrivate"
                />
              </FormGroup>
            </Box>
          )}
        </Form>
      )}
    </div>
  )
})

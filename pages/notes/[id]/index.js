/* eslint-disable no-console */
import { useEffect, useMemo } from 'react'
import Head from 'next/head'
import { TheNotePage } from '~/common/components/TheNotePage'
import { useGlobalAppContext } from '~/common/hooks'

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT

const Note = ({ note }) => {
  const {
    state: { activeNote },
    handleSetAsActiveNote,
  } = useGlobalAppContext()
  const key = useMemo(() => activeNote?._id || note?.id || `the-note-page-init-key-${Math.random()}`, [
    activeNote?._id,
    note?.id,
  ])
  useEffect(() => {
    if (!!note) handleSetAsActiveNote(note)
  }, [note])

  return (
    <>
      <Head>
        <meta property="og:site_name" content="Code Samples 2.0" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://code-samples.space" />
        <meta property="og:image" content="http://code-samples.space/static/icons/apple-touch-icon.png" />

        <meta name="twitter:url" content="http://code-samples.space" />
        <meta name="twitter:image" content="http://code-samples.space/static/icons/icon-512x512.png" />
        <meta name="twitter:creator" content="@pravosleva86" />
        <meta name="twitter:card" content="summary" />
        {!!note?._id ? (
          <>
            <title>{note.title}</title>
            <meta property="og:title" content={note.title} />
            <meta property="og:description" content={note.description} />
            <meta name="twitter:title" content={note.title} />
            <meta name="twitter:description" content={note.description} />
          </>
        ) : (
          <>
            <title>WTF?</title>
            <meta property="og:title" content="Code Samples 2.0" />
            <meta property="og:description" content="No description" />
            <meta property="twitter:title" content="Code Samples 2.0" />
            <meta name="twitter:description" content="Смотри что я нашел!" />
          </>
        )}
      </Head>

      <TheNotePage initNote={activeNote || note} key={key} />
    </>
  )
}

Note.getInitialProps = async ({ query: { id } }) => {
  const res = await fetch(`${NEXT_APP_API_ENDPOINT}/notes/${id}`)
  const { data } = await res.json()

  return { note: data }
}

export default Note

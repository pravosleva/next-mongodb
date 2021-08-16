/* eslint-disable no-console */
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TheNotePage } from '~/common/components/TheNotePage'
import { httpClient } from '~/utils/httpClient'
import { useAuthContext } from '~/common/hooks'
import { useRouter } from 'next/router'
import { Loader } from 'semantic-ui-react'

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT

const Note = ({ note }) => {
  const { isLogged } = useAuthContext()
  const [noteData, seNoteData] = useState(null)
  const router = useRouter()
  const { query } = router
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLogged && !note?._id && !!query.id) {
      try {
        setIsLoading(true)
        httpClient
          .getNote(query.id)
          .then((data) => {
            seNoteData({ ...data, id: data._id })
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setIsLoading(false)
          })
      } catch (err) {
        console.log(err)
      }
    }
  }, [isLogged, setIsLoading])

  return (
    <>
      <Head>
        <meta property="og:site_name" content="Code Samples 2.0" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://code-samples.space" />
        <meta property="og:image" content="http://code-samples.space/static/icons/apple-touch-icon.png" />

        <meta name="twitter:url" content="http://code-samples.space" />
        <meta name="twitter:title" content="Code Samples 2.0" />
        <meta name="twitter:image" content="http://code-samples.space/static/icons/icon-512x512.png" />
        <meta name="twitter:creator" content="@pravosleva86" />
        <meta name="twitter:card" content="summary" />
        {!!noteData?._id ? (
          <>
            <title>{noteData.title}</title>
            <meta property="og:title" content={noteData.title} />
            <meta property="og:description" content={noteData.description} />
            <meta name="twitter:description" content={noteData.description} />
          </>
        ) : (
          <>
            <title>WTF?</title>
            <meta property="og:title" content="Code Samples 2.0" />
            <meta property="og:description" content="No description" />
            <meta name="twitter:description" content="Смотри что я нашел!" />
          </>
        )}
      </Head>

      <TheNotePage initNote={noteData} key={noteData?.id || 'the-note-page-init-key'} />

      {isLoading && (
        <div style={{ marginTop: '24px' }}>
          <Loader active inline="centered" />
        </div>
      )}
    </>
  )
}

Note.getInitialProps = async ({ query: { id } }) => {
  const res = await fetch(`${NEXT_APP_API_ENDPOINT}/notes/${id}`)
  const { data } = await res.json()

  return { note: data }
}

export default Note

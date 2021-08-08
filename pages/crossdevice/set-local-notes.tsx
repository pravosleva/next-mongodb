import { lazy, Suspense, useEffect, useMemo } from 'react'
import { httpClient } from '~/utils/httpClient'
import {
  useGlobalAppContext,
  // ELSFields, useNotifsContext
} from '~/common/hooks'
import { Alert, AlertTitle } from '@material-ui/lab'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import { useRouter } from 'next/router'
import Icon from '@mdi/react'
import { mdiArrowRight } from '@mdi/js'
// import ReactJson from 'react-json-view'
import plural from 'plural-ru'

const ReactJson = lazy(
  () =>
    // @ts-ignore
    import(/* webpackChunkName: "ReactJson" */ 'react-json-view')
)

const SetLocalNotesPage = ({ data, message, isOk }: any) => {
  const { addNewLSData } = useGlobalAppContext()
  // const { addDangerNotif } = useNotifsContext()
  const router = useRouter()

  useEffect(() => {
    if (isOk && !!data.lsData) addNewLSData(data.lsData)
  }, [])
  const isClient = useMemo(() => typeof window !== 'undefined', [typeof window])
  const uiMsg = useMemo(
    () =>
      `В память данного устройства ${plural(data?.lsData?.length, 'добавлена', 'добавлены', 'добавлено')} ${
        data?.lsData?.length
      } ${plural(data?.lsData?.length, 'заметка', 'заметки', 'заметок')}`,

    [data?.lsData?.length]
  )

  return (
    <div>
      <h1>isOk: {String(isOk)}</h1>
      {!isOk ? (
        <Alert className="info" variant="outlined" severity="error" style={{ marginBottom: '16px' }}>
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      ) : (
        <>
          <Alert className="info" variant="outlined" severity="success" style={{ marginBottom: '16px' }}>
            <AlertTitle>QR Used: New Local Notes</AlertTitle>
            <div
            // style={{ marginBottom: '8px' }}
            >
              {uiMsg}
            </div>
            {/*
            <pre style={{ whiteSpace: 'pre-wrap', margin: '0px', overflow: 'auto' }}>
              {JSON.stringify(
                {
                  ip: data.ip,
                  geo: data.geo,
                  lsData: data.lsData,
                },
                null,
                2
              )}
            </pre>
            */}
          </Alert>
          {isClient && (
            <Suspense fallback={<div>Loading...</div>}>
              <div
                style={{
                  width: '100%',
                  // border: '1px solid lightgray',
                  overflowX: 'auto',
                  marginBottom: '16px',
                  // borderRadius: '8px',
                  // padding: '8px 0',
                }}
              >
                <ReactJson src={data} collapsed />
              </div>
            </Suspense>
          )}
        </>
      )}
      <ThemedButton
        // style={{ marginBottom: '8px' }}
        // fullWidth
        size="small"
        color={EColorValue.blueNoShadow}
        variant="contained"
        onClick={() => {
          router.push('/')
        }}
        endIcon={<Icon path={mdiArrowRight} size={0.7} />}
      >
        Перейти на главную
      </ThemedButton>
    </div>
  )
}

SetLocalNotesPage.getInitialProps = async ({ query: { payload } }: any) => {
  const result = await httpClient
    .getMyLocalNotes({ payload })
    .then((res: any) => {
      const { data, message } = res

      // console.log(res)
      return {
        data,
        message,
        isOk: true,
      }
    })
    .catch((err: any) => ({
      message: typeof err === 'string' ? err : err.message || 'No err.message',
      isOk: false,
    }))

  return result
}

export default SetLocalNotesPage

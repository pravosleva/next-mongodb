import { useEffect } from 'react'
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

const SetLocalNotesPage = ({ data, message, isOk }: any) => {
  const { addNewLSData } = useGlobalAppContext()
  // const { addDangerNotif } = useNotifsContext()
  const router = useRouter()

  useEffect(() => {
    if (isOk && !!data.lsData) addNewLSData(data.lsData)
  }, [])
  return (
    <div>
      <h1>isOk={String(isOk)}</h1>
      {!isOk ? (
        <Alert className="info" variant="outlined" severity="error" style={{ marginBottom: '16px' }}>
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      ) : (
        <Alert className="info" variant="outlined" severity="success" style={{ marginBottom: '16px' }}>
          <AlertTitle>New notes added</AlertTitle>
          <div style={{ marginBottom: '8px' }}>{message}</div>
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
        </Alert>
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

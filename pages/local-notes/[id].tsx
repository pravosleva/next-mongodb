import { useEffect, useState, useMemo } from 'react'
import { TheNotePage } from '~/common/components/TheNotePage'
import { useGlobalAppContext } from '~/common/hooks'
import { useRouter } from 'next/router'
import { Alert } from '@material-ui/lab'
// import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
// import Icon from '@mdi/react'
// import { mdiArrowRight } from '@mdi/js'

const LocalNote = () => {
  const { localNotes, handleSetAsActiveNote } = useGlobalAppContext()
  const router = useRouter()
  const targetNote = useMemo(() => (!!localNotes ? localNotes.find(({ id }) => id === router.query.id) : null), [
    router.query.id,
    localNotes,
  ])

  useEffect(() => {
    if (!!targetNote) {
      // @ts-ignore
      handleSetAsActiveNote({ ...targetNote, _id: targetNote.id, isLocal: true })
    }
  }, [targetNote])

  const [specialMsg, setSpecialMsg] = useState<string>('Please wait...')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        setSpecialMsg('Нет в LS')
      }, 7000)
    }
  }, [typeof window])

  if (!!targetNote) {
    // @ts-ignore
    return <TheNotePage initNote={{ ...targetNote, isLocal: true }} />
  } else {
    return (
      <div style={{ margin: '16px 0 16px 0' }}>
        <Alert variant="outlined" severity="info" style={{ marginBottom: '16px' }}>
          {/* <AlertTitle>Error</AlertTitle> */}
          {specialMsg}
        </Alert>
        {/* <ThemedButton
          size="small"
          color={EColorValue.blueNoShadow}
          variant="contained"
          onClick={() => {
            router.push('/')
          }}
          endIcon={<Icon path={mdiArrowRight} size={0.7} />}
        >
          Перейти на главную
        </ThemedButton> */}
      </div>
    )
  }
}

export default LocalNote

import { useEffect, useState, useMemo } from 'react'
import { TheNotePage } from '~/common/components/TheNotePage'
import { useGlobalAppContext } from '~/common/hooks'
import { useRouter } from 'next/router'

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
    return <div style={{ margin: '16px 0 16px 0' }}>{specialMsg}</div>
  }
}

export default LocalNote

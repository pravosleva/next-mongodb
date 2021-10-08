/* eslint-disable no-console */
import ChipInput from 'material-ui-chip-input'
import { useState, useEffect, useRef } from 'react'
import { ELSFields } from '~/common/context/GlobalAppContext/interfaces'
import { useGlobalAppContext } from '~/common/context/GlobalAppContext'
import buildUrl from 'build-url'

const NEXT_APP_API_ENDPOINT = process.env.NEXT_APP_API_ENDPOINT || ''

export const SubscribeTags = () => {
  const [chips, setChips] = useState<string[]>([])
  const { getFieldFromLS, setFieldToLS } = useGlobalAppContext()
  const renderSCountRef = useRef<number>(0)
  // @ts-ignore
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    renderSCountRef.current += 1
    getFieldFromLS(ELSFields.SubscribedTags, true)
      .then((oldLSData) => {
        if (!Array.isArray(oldLSData)) throw new Error("WTF? oldData isn't an Array")
        setChips(oldLSData)
      })
      .catch((err) => {
        console.log(err)
        setFieldToLS(ELSFields.SubscribedTags, [], true)
          .then(() => {
            setChips([])
          })
          .catch((err) => {
            console.log(err)
          })
      })
  }, [])

  const handleAddChip = (chip: string) => {
    setChips((s) => [...new Set([...s, chip])])
  }
  const handleDeleteChip = (chip: string, _i: number) => {
    setChips((s) => s.filter((c) => c !== chip))
  }

  useEffect(() => {
    renderSCountRef.current += 1
    if (renderSCountRef.current <= 2) return
    setFieldToLS(ELSFields.SubscribedTags, chips, true)

    const fetchData = async () => {
      const queryParams: any = {
        limit: 50,
        // page: 1,
      }
      queryParams.q_titles = chips.join(',')
      const url = buildUrl(NEXT_APP_API_ENDPOINT, {
        path: '/notes',
        queryParams,
      })
      const res = await fetch(url, {
        // @ts-ignore
        // headers: getStandardHeadersByCtx(),
      })
      // setIsLoading(false)
      // @ts-ignore
      const { data, pagination } = await res.json()

      if (Array.isArray(data)) setNotes(data)

      // dispatch({ type: 'NOTES_RESPONSE@SET', payload: { notes: data, pagination } })
    }

    let _sendReqTimeout: any
    function startReq() {
      _sendReqTimeout = setTimeout(fetchData, 500)
    }
    function stopReq() {
      clearTimeout(_sendReqTimeout)
    }
    if (chips.length > 0) {
      startReq()
    } else {
      setNotes([])
    }

    return () => {
      if (!!_sendReqTimeout) stopReq()
    }
  }, [JSON.stringify(chips)])

  return (
    <>
      <ChipInput
        value={chips}
        onAdd={(chip) => handleAddChip(chip)}
        onDelete={(chip, index) => handleDeleteChip(chip, index)}
      />
      <div>
        <pre>{`options.title = { $in: q_titles.split(',') }`}</pre>
      </div>
    </>
  )
}

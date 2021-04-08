import { useState, useMemo } from 'react'
import { Button, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import { mdiPin } from '@mdi/js'

export const PinNote = ({ id, ...rest }: { id: string; [key: string]: any }) => {
  // eslint-disable-next-line no-console
  // const onSubmit = (data: any) => console.log(data)
  // const ref = useRef(null)
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const { handlePinToLS, pinnedMap } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])
  // @ts-ignore
  const options = useMemo(
    () =>
      !!pinnedMap
        ? // @ts-ignore
          pinnedMapKeys.map((key) => ({ title: pinnedMap[key].title, namespace: key }))
        : [],
    [pinnedMapKeys, pinnedMap]
  )
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null)

  if (!options || options.length === 0) return null
  return (
    <>
      {!isOpened && (
        <Button
          // disabled={isNotesLoading}
          variant="outlined"
          size="small"
          color="default"
          onClick={() => {
            // @ts-ignore
            // handlePinToLS({ id })
            setIsOpened(true)
          }}
          startIcon={<MdiIcon path={mdiPin} size={0.7} />}
          // disabled={isIdPinned(note._id)}
          {...rest}
        >
          Pin
        </Button>
      )}
      {isOpened && options.length > 0 && (
        <>
          <Autocomplete
            clearOnEscape
            disableClearable
            size="small"
            options={options}
            getOptionLabel={(option) =>
              !!option.title ? option.title.toString() : `No title: ${JSON.stringify(option)}`
            }
            // style={{ width: 300 }}
            // fullWidth
            // value={''}
            onChange={(_e, arg) => {
              if (!arg) return

              const { namespace } = arg

              setSelectedNamespace(namespace)
            }}
            renderInput={(params) => (
              <TextField
                style={{ minWidth: '150px' }}
                {...params}
                label="NS"
                variant="outlined"
                // size="small"
              />
            )}
            style={
              {
                // margin: '0 8px 0 0',
                // transform: 'translateY(-6px)',
                // maxHeight: '10px !important',
              }
            }
          />
          {!!selectedNamespace && (
            <Button
              // disabled={isNotesLoading}
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                // @ts-ignore
                handlePinToLS({ id, namespace: selectedNamespace })
                setIsOpened(false)
              }}
              startIcon={<MdiIcon path={mdiPin} size={0.7} />}
              // disabled={isIdPinned(note._id)}
              {...rest}
            >
              Done
            </Button>
          )}

          {/* <datalist id="s">
            <option value="Чебурашка"></option>
            <option value="Крокодил Гена"></option>
            <option value="Шапокляк"></option>
          </datalist> */}
        </>
      )}
    </>
  )
}

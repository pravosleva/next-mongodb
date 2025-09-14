import { useState, useMemo, useCallback } from 'react'
import { Button, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useGlobalAppContext } from '~/common/hooks'
import MdiIcon from '@mdi/react'
import { mdiPin, mdiClose } from '@mdi/js'
import { ELSFields } from '~/common/context/GlobalAppContext'

export const PinNote = ({ id, isLocal, ...rest }: { id: string; isLocal?: boolean; [key: string]: any }) => {
  // eslint-disable-next-line no-console
  // const onSubmit = (data: any) => console.log(data)
  // const ref = useRef(null)
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleClose = useCallback(() => {
    setIsOpened(false)
  }, [setIsOpened])
  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [setIsOpened])
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
          onClick={handleOpen}
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
                style={{ minWidth: '190px' }}
                {...params}
                label="Namespace"
                variant="outlined"
                color={isLocal ? 'secondary' : 'primary'}
                size="small"
              />
            )}
          />
          <Button
            variant="text"
            size="small"
            color="secondary" // {isLocal ? 'secondary' : 'primary'}
            onClick={handleClose}
            endIcon={<MdiIcon path={mdiClose} size={0.7} />}
            {...rest}
          >
            Cancel
          </Button>
          {!!selectedNamespace && (
            <Button
              // disabled={isNotesLoading}
              variant="contained"
              size="small"
              color="secondary" // {isLocal ? 'secondary' : 'primary'}
              onClick={() => {
                // @ts-ignore
                handlePinToLS({ id, namespace: selectedNamespace }, ELSFields.MainPinnedNamespaceMap)
                handleClose()
              }}
              endIcon={<MdiIcon path={mdiPin} size={0.7} />}
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

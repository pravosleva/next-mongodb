import { useMemo, useCallback, useEffect } from 'react'
import { useGlobalAppContext, useForm } from '~/common/hooks'
import { ELSFields } from '~/common/context/GlobalAppContext'
import TextField from '@material-ui/core/TextField'
import { useStyles } from './styles'
import { Namespace } from './components'
import { CollabsibleContent } from '~/common/components/CollabsibleContent'
import clsx from 'clsx'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import CloseIcon from '@material-ui/icons/Close'

type TForm = {
  byTitleOrDescr: string
}

const initialState: TForm = {
  byTitleOrDescr: '',
}

export const LSResult = () => {
  const classes = useStyles()
  const { pinnedMap, setFieldToLS, getFieldFromLS } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])
  const { formData, handleInputChange } = useForm(initialState)
  const checkByTitleOrDescr = useCallback(
    ({ title, description }) => {
      if (!!formData.byTitleOrDescr) {
        if (
          title.toLowerCase().includes(formData.byTitleOrDescr.toLowerCase()) ||
          description.toLowerCase().includes(formData.byTitleOrDescr.toLowerCase())
        ) {
          return true
        }
        return false
      }
      return true
    },
    [formData.byTitleOrDescr]
  )
  const clearSerch = useCallback(() => {
    handleInputChange({ target: { value: '', name: 'byTitleOrDescr' } })
    setFieldToLS(ELSFields.PinnedNotesSearchField, { byTitleOrDescr: '' }, true)
  }, [handleInputChange, setFieldToLS])
  useEffect(() => {
    getFieldFromLS(ELSFields.PinnedNotesSearchField, true)
      .then((jsonFromLS) => {
        if (!!jsonFromLS.byTitleOrDescr) {
          handleInputChange({ target: { value: jsonFromLS.byTitleOrDescr, name: 'byTitleOrDescr' } })
        }
      })
      .catch(() => {})
  }, [])
  // const pinnedKeysToDisplay = useMemo(
  //   () =>
  //     pinnedMapKeys
  //       .map((key) => {
  //         // @ts-ignore
  //         // const data = pinnedMap ? pinnedMap[key] : null
  //         const shouldBeDisplayed = checkByTitleOrDescr({
  //           // @ts-ignore
  //           title: pinnedMap[key].title,
  //           // @ts-ignore
  //           description: pinnedMap[key].description || '',
  //         })

  //         if (!shouldBeDisplayed) return 0
  //         return 1
  //         // return <Namespace key={key} data={data} />
  //       })
  //       .filter((elm) => elm === 1),
  //   [pinnedMapKeys, pinnedMap, checkByTitleOrDescr]
  // )

  const { state } = useGlobalAppContext()
  const { activeNote } = useMemo(() => state, [JSON.stringify(state)])
  const activeId = useMemo(() => activeNote?._id, [activeNote])
  const checkHasActiveId = useCallback((ids: string[]) => ids.includes(activeId), [activeId])

  return (
    <div className={classes.wrapper}>
      {pinnedMapKeys.length === 0 && <em>No namespaces yet...</em>}
      {pinnedMapKeys.length > 0 && (
        <>
          <TextField
            className="search"
            // style={{ marginBottom: '8px' }}
            // autoFocus
            size="small"
            label="Search by title or description"
            // required
            type="text"
            variant="outlined"
            fullWidth
            // placeholder="Search..."
            name="byTitleOrDescr"
            value={formData.byTitleOrDescr}
            onChange={(e) => {
              handleInputChange(e)
              setFieldToLS(ELSFields.PinnedNotesSearchField, { byTitleOrDescr: e.target.value }, true)
            }}
            autoComplete="off"
          />
          {formData.byTitleOrDescr.length > 0 && (
            <ThemedButton
              size="small"
              color={EColorValue.grey}
              variant="contained"
              onClick={clearSerch}
              className="clear-btn"
              // fullWidth
              endIcon={<CloseIcon />}
              disabled={formData.byTitleOrDescr.length === 0}
            >
              Clear
            </ThemedButton>
          )}
        </>
      )}
      {!!pinnedMap &&
        pinnedMapKeys.map((key) => {
          // @ts-ignore
          const data: any = pinnedMap ? pinnedMap[key] : null
          const shouldBeDisplayed = checkByTitleOrDescr({
            // @ts-ignore
            title: pinnedMap[key].title,
            // @ts-ignore
            description: pinnedMap[key].description || '',
          })
          // @ts-ignore
          const hasActiveId = !!data && checkHasActiveId(data.ids || [])

          if (!shouldBeDisplayed && !hasActiveId) return null
          return !!data ? (
            <div key={key} className={clsx(classes.collapsibleWrapper, 'collapsible-wrapper')}>
              <CollabsibleContent
                activeTitleColor="#3882C4"
                inactiveTitleColor="#949494"
                isRightSide
                // @ts-ignore
                title={`${hasActiveId ? `🔥 ` : ''}${data.title} ${data.ids.length}/${data.limit}`}
                // @ts-ignore
                contentRenderer={(_collabsiblePs) => <Namespace key={`${key}-${pinnedMap[key].ts}`} data={data} />}
              />
            </div>
          ) : (
            <div>No data for {key}</div>
          )
          // return <Namespace key={key} data={data} />
        })}
    </div>
  )
}

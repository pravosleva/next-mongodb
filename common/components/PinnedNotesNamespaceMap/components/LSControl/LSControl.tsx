import { useMemo, Fragment, useCallback } from 'react'
import { useGlobalAppContext, useForm } from '~/common/hooks'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import { useStyles } from './styles'
// import MdiIcon from '@mdi/react'
// import { mdiArrowDown } from '@mdi/js'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import Alert from '@material-ui/lab/Alert'
import { EditBtn } from './components'
import { ELSFields } from '~/common/context/GlobalAppContext'
import TextField from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'

type TForm = {
  byTitleOrDescr: string
}

const initialState: TForm = {
  byTitleOrDescr: '',
}

export const LSControl = () => {
  const classes = useStyles()
  const { pinnedMap, removeNamespace } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])
  const { formData, handleInputChange } = useForm(initialState)
  const clearSerch = useCallback(() => {
    handleInputChange({ target: { value: '', name: 'byTitleOrDescr' } })
  }, [handleInputChange])
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

  return (
    <div className={classes.wrapper}>
      <Alert variant="outlined" severity="error">
        Be careful before do anything!
      </Alert>
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
            onChange={handleInputChange}
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
      {pinnedMapKeys.length > 0 &&
        pinnedMapKeys.map((key) => {
          const shouldBeDisplayed = checkByTitleOrDescr({
            // @ts-ignore
            title: pinnedMap[key].title,
            // @ts-ignore
            description: pinnedMap[key].description || '',
          })

          if (!shouldBeDisplayed) return null

          return (
            <Fragment key={key}>
              <EditBtn
                // @ts-ignore
                key={pinnedMap[key].ts}
                namespace={key}
                // @ts-ignore
                data={pinnedMap[key]}
                leftBtn={() => (
                  <ThemedButton
                    size="small"
                    color={EColorValue.redNoShadow}
                    variant="contained"
                    onClick={() => {
                      removeNamespace(key, ELSFields.MainPinnedNamespaceMap)
                    }}
                    fullWidth
                    endIcon={<DeleteOutlineIcon />}
                    style={{ borderRadius: '8px 0px 0px 0px' }}
                  >
                    Remove
                  </ThemedButton>
                )}
              />
              {
                // @ts-ignore
                !!pinnedMap[key] && (
                  <div style={{ border: '1px solid lightgray', padding: '8px', borderRadius: '0px 0px 8px 8px' }}>
                    <b>
                      <em>Before:</em>
                    </b>
                    <pre style={{ margin: '0px', fontSize: '10px', whiteSpace: 'pre-wrap' }}>
                      {/* @ts-ignore */}
                      {JSON.stringify(pinnedMap[key], null, 2)}
                    </pre>
                  </div>
                )
              }
            </Fragment>
          )
        })}
    </div>
  )
}

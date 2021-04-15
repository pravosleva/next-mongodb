import { useMemo, Fragment } from 'react'
import { useGlobalAppContext } from '~/common/hooks'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import { useStyles } from './styles'
import MdiIcon from '@mdi/react'
import { mdiArrowDown } from '@mdi/js'
import Alert from '@material-ui/lab/Alert'
import { EditBtn } from './components'
import { ELSFields } from '~/common/context/GlobalAppContext'

export const LSControl = () => {
  const classes = useStyles()
  const { pinnedMap, removeNamespace } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])

  return (
    <div className={classes.wrapper}>
      <Alert variant="outlined" severity="error">
        Be careful before do anything!
      </Alert>
      {pinnedMapKeys.length === 0 && <em>No namespaces yet...</em>}
      {pinnedMapKeys.length > 0 &&
        pinnedMapKeys.map((key) => {
          return (
            <Fragment key={key}>
              <ThemedButton
                size="small"
                color={EColorValue.redNoShadow}
                variant="contained"
                onClick={() => {
                  removeNamespace(key, ELSFields.Main)
                }}
                endIcon={<MdiIcon path={mdiArrowDown} size={0.7} />}
              >
                Remove Namespace
              </ThemedButton>
              {/* @ts-ignore */}
              <EditBtn key={pinnedMap[key].ts} namespace={key} data={pinnedMap[key]} />
              {
                // @ts-ignore
                !!pinnedMap[key] && (
                  <div>
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

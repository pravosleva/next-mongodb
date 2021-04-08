import { useMemo, Fragment } from 'react'
import { useGlobalAppContext } from '~/common/hooks'
import { ThemedButton } from '~/common/styled-mui/custom-button'
import { useStyles } from './styles'
import MdiIcon from '@mdi/react'
import { mdiArrowDown } from '@mdi/js'

export const LSControl = () => {
  const classes = useStyles()
  const { pinnedMap, removeNamespace } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])

  if (!pinnedMap) return <div>WTF?</div>
  return (
    <div className={classes.wrapper}>
      {pinnedMapKeys.length > 0 &&
        pinnedMapKeys.map((key) => {
          return (
            <Fragment key={key}>
              <ThemedButton
                size="small"
                color="grey"
                variant="contained"
                onClick={() => {
                  removeNamespace(key)
                }}
                endIcon={<MdiIcon path={mdiArrowDown} size={0.7} />}
              >
                Remove Namespace
              </ThemedButton>
              {
                // @ts-ignore
                !!pinnedMap[key] && (
                  // @ts-ignore
                  <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
                    {/* @ts-ignore */}
                    {JSON.stringify(pinnedMap[key], null, 2)}
                  </pre>
                )
              }
            </Fragment>
          )
        })}
    </div>
  )
}

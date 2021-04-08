import { useMemo, Fragment } from 'react'
import { useGlobalAppContext } from '~/common/hooks'
import { useStyles } from './styles'

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
              <button
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('REMOVE', key)
                  removeNamespace(key)
                }}
              >
                Remove {key}
              </button>
              {
                // @ts-ignore
                !!pinnedMap[key] && (
                  // @ts-ignore
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(pinnedMap[key], null, 2)}</pre>
                )
              }
            </Fragment>
          )
        })}
    </div>
  )
}

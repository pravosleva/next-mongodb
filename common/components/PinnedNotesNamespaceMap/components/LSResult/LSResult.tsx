import { useMemo } from 'react'
import { useGlobalAppContext } from '~/common/hooks'
import { useStyles } from './styles'
import { Namespace } from './components'

export const LSResult = () => {
  const classes = useStyles()
  const { pinnedMap } = useGlobalAppContext()
  const pinnedMapKeys = useMemo(() => Object.keys(pinnedMap || {}), [pinnedMap])

  return (
    <div className={classes.wrapper}>
      {pinnedMapKeys.length === 0 && <em>No namespaces yet...</em>}
      {pinnedMapKeys.map((key) => {
        // @ts-ignore
        const data = pinnedMap ? pinnedMap[key] : null

        return <Namespace key={key} data={data} />
      })}
    </div>
  )
}

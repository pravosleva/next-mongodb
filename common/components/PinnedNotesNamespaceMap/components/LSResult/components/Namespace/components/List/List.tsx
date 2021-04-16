import { useMemo } from 'react'
import { Badge } from './components'
import { useStyles } from './styles'

type TProps = {
  ids: string[]
}

export const List = ({ ids }: TProps) => {
  const classes = useStyles()
  const MemoizedList = useMemo(
    () => (
      <ul className={classes.list}>
        {ids.map((id) => {
          return <Badge key={id} id={id} />
        })}
      </ul>
    ),
    [ids.length]
  )

  if (!ids || ids.length === 0) return null
  return MemoizedList
}

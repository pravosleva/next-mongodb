import { Badge } from './components'
import { useStyles } from './styles'

type TProps = {
  ids: string[]
}

export const List = ({ ids }: TProps) => {
  const classes = useStyles()

  if (ids.length === 0) return null
  return (
    <ul className={classes.list}>
      {ids.map((id) => {
        return <Badge key={id} id={id} />
      })}
    </ul>
  )
}

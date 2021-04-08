import clsx from 'clsx'
import { useStyles } from './styles'

type TProps = {
  id: string
}

export const Badge = ({ id }: TProps) => {
  const classes = useStyles()

  return <li className={clsx(classes.truncate, classes.badge, classes.defaultBadge)}>{id}</li>
}

import { List } from './components'
import { useStyles } from './styles'

type TProps = {
  data: {
    namespace: string
    limit: number
    title: string
    description: string
    ids: string[]
  }
}

export const Namespace = ({ data }: TProps) => {
  const classes = useStyles()
  const {
    // title,
    ids,
    description,
    // limit,
  } = data

  return (
    <div className={classes.wrapper}>
      {/* <h4>
        {title} ({ids.length} of {limit})
      </h4> */}
      {!!description && (
        <div
          style={{
            color: 'grey',
          }}
        >
          <em>{description}</em>
        </div>
      )}
      {ids.length > 0 ? <List ids={ids} /> : <em>Теперь Вы можете прикрепить заметки (кнопка PIN)</em>}
    </div>
  )
}

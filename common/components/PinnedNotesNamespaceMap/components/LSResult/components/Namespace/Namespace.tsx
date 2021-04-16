import { List } from './components'
import { useStyles } from './styles'
import Alert from '@material-ui/lab/Alert'

type TProps = {
  data: {
    namespace: string
    limit: number
    title: string
    description: string
    ids: string[]
    ts: number
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
      {ids.length > 0 ? (
        <List ids={ids} />
      ) : (
        <Alert className="info" variant="outlined" severity="info">
          Теперь Вы можете прикрепить заметки кнопкой PIN
        </Alert>
      )}
    </div>
  )
}

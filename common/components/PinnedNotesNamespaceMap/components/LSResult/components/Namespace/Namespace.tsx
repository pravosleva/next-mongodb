import { List } from './components'

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
  const { title, ids, description, limit } = data

  return (
    <div>
      <h4 style={{ marginBottom: '8px' }}>
        {title} ({ids.length} of {limit})
      </h4>
      {!!description && (
        <div
          style={{
            marginBottom: '8px',
            color: 'grey',
          }}
        >
          <em>{description}</em>
        </div>
      )}
      <List ids={ids} />
    </div>
  )
}

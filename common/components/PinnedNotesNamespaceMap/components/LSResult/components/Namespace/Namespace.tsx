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
  const { title, ids, description } = data

  return (
    <div>
      <h4>{title}</h4>
      <div
        style={{
          marginBottom: '8px',
        }}
      >
        <em>{description}</em>
      </div>
      <List ids={ids} />
    </div>
  )
}

import { useCallback, useState } from 'react'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import MdiIcon from '@mdi/react'
import { mdiPencil } from '@mdi/js'
import { Stepper } from '~/common/components/Stepper'
import { useStyles } from './styles'

import { useForm } from '~/common/hooks'
import TextField from '@material-ui/core/TextField'

export type NamespaceData = {
  ids: string[]
  title: string
  description: string
  limit: number
}
type TProps = {
  data: NamespaceData
  namespace: string
}

type TStepContentProps = {
  data: NamespaceData
  onInputChange: (e: any) => void
  formData: NamespaceData
  getNormalizedForm: (f: any) => any
}

const steps = [
  {
    title: 'Set Title',
    content: ({ data, onInputChange, formData, getNormalizedForm }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Title"
            required
            type="text"
            variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="title"
            // defaultValue={data.title}
            value={formData.title || data.title}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(getNormalizedForm(formData), null, 2)}
          </pre>
        </>
      )
    },
  },
  {
    title: 'Set Description',
    content: ({ data, onInputChange, formData, getNormalizedForm }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Description"
            required
            type="text"
            variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="description"
            // defaultValue={data.description}
            value={formData.description || data.description}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(getNormalizedForm(formData), null, 2)}
          </pre>
        </>
      )
    },
  },
  {
    title: 'Set Limit',
    description: 'Количество заметок при привышении которого более старые будут удалены',
    content: ({ data, onInputChange, formData, getNormalizedForm }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Description"
            required
            type="number"
            // variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="limit"
            // defaultValue={data.limit}
            value={Number(formData.limit) || data.limit}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(getNormalizedForm(formData), null, 2)}
          </pre>
        </>
      )
    },
  },
]

const initialState = {
  title: '',
  description: '',
  limit: 5,
  ids: [],
}

// @ts-ignore
export const EditBtn = ({ namespace, data }: TProps) => {
  const classes = useStyles()
  const [isFromOpened, setIsFormOpened] = useState<boolean>(false)
  const handleOpen = useCallback(() => {
    setIsFormOpened(true)
  }, [setIsFormOpened])
  const handleClose = useCallback(() => {
    setIsFormOpened(false)
  }, [setIsFormOpened])
  const { formData, handleInputChange } = useForm({ ...initialState, ...data })
  const getNormalizedForm = useCallback((formData) => {
    const normalizedForm: Partial<NamespaceData> | any = {}

    for (const key in formData) {
      switch (true) {
        case key === 'limit':
          normalizedForm[key] = Number(formData[key])
          break
        default:
          normalizedForm[key] = formData[key]
          break
      }
    }

    return normalizedForm
  }, [])
  const handleSave = useCallback(() => {
    // TODO: New data in formData
    const normalizedForm = getNormalizedForm(formData)

    // eslint-disable-next-line no-console
    console.log(normalizedForm)

    // TODO:
    // Use api from GlobalAppContext (as Promise?)
  }, [formData])

  return (
    <div className={classes.wrapper}>
      {!isFromOpened ? (
        <ThemedButton
          size="small"
          color={EColorValue.grey}
          variant="contained"
          onClick={handleOpen}
          fullWidth
          endIcon={<MdiIcon path={mdiPencil} size={0.7} />}
        >
          Edit
        </ThemedButton>
      ) : (
        <Stepper
          onClose={handleClose}
          onSave={handleSave}
          steps={steps}
          data={data}
          formData={formData}
          onInputChange={handleInputChange}
          getNormalizedForm={getNormalizedForm}
        />
      )}
    </div>
  )
}

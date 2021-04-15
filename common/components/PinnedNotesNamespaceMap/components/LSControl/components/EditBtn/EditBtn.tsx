import { useCallback, useState, useMemo } from 'react'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import MdiIcon from '@mdi/react'
import { mdiPencil } from '@mdi/js'
import { Stepper } from '~/common/components/Stepper'
import { useStyles } from './styles'
import { ELSFields } from '~/common/context/GlobalAppContext'
import { useForm, useGlobalAppContext } from '~/common/hooks'
import TextField from '@material-ui/core/TextField'

export type TNamespaceData = {
  ids: string[]
  title: string
  description: string
  limit: number
}
type TProps = {
  data: TNamespaceData
  namespace: string
}

type TStepContentProps = {
  data: TNamespaceData
  onInputChange: (e: any) => void
  formData: any
  normalizedForm: TNamespaceData
  formErrors: {
    [key: string]: any
    blockedSteps?: number[]
  }
}

function getDiffs(obj1: any, obj2: any): any {
  const result: any = {}
  if (Object.is(obj1, obj2)) {
    return undefined
  }
  if (!obj2 || typeof obj2 !== 'object') {
    return obj2
  }
  Object.keys(obj1 || {})
    .concat(Object.keys(obj2 || {}))
    .forEach((key) => {
      if (Array.isArray(obj1[key]) || Array.isArray(obj2[key])) {
        return
      }
      if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key]
      }
      if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        const value = getDiffs(obj1[key], obj2[key])
        if (value !== undefined) {
          result[key] = value
        }
      }
    })
  return result
}

const steps = [
  {
    title: 'Set Title',
    content: ({ data, onInputChange, normalizedForm, formErrors }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Title"
            required
            error={!!formErrors.title}
            helperText={formErrors.title}
            type="text"
            variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="title"
            defaultValue={data.title}
            value={normalizedForm.title}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalizedForm, null, 2)}</pre>
        </>
      )
    },
  },
  {
    title: 'Set Description',
    content: ({ data, onInputChange, normalizedForm }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Description"
            // required
            type="text"
            variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="description"
            defaultValue={data.description}
            value={normalizedForm.description}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalizedForm, null, 2)}</pre>
        </>
      )
    },
  },
  {
    title: 'Set Limit',
    description: 'Количество заметок при привышении которого более старые будут удалены',
    content: ({ data, onInputChange, normalizedForm, formData, formErrors }: TStepContentProps) => {
      return (
        <>
          <TextField
            size="small"
            label="Limit"
            required
            error={!!formErrors.limit}
            helperText={formErrors.limit}
            type="number"
            // variant="outlined"
            fullWidth
            // placeholder="Namespace"
            name="limit"
            defaultValue={data.limit}
            value={formData.limit}
            onChange={onInputChange}
            autoComplete="off"
            autoFocus
            style={{ marginBottom: '8px' }}
          />
          <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalizedForm, null, 2)}</pre>
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
  const { formData, handleInputChange, resetForm } = useForm({ ...initialState, ...data })
  const getNormalizedForm = useCallback((formData) => {
    const normalizedForm: Partial<TNamespaceData> | any = {}

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
  const normalizedData = useMemo(() => getNormalizedForm(formData), [formData])
  const getFormErrorsObj = (normalizedData: TNamespaceData) => {
    const result: { [key: string]: any } = {
      blockedSteps: [],
    }

    for (const key in normalizedData) {
      switch (true) {
        case key === 'title' && !normalizedData[key]:
          result[key] = 'Could not be empty'
          result.blockedSteps.push(0)
          break
        case key === 'limit' && (!normalizedData[key] || normalizedData[key] < 0):
          result[key] = 'Could not be empty or zero'
          result.blockedSteps.push(2)
          break
        default:
          break
      }
    }

    return result
  }
  const formErrors = useMemo(() => getFormErrorsObj(normalizedData), [normalizedData])
  const { replaceNamespaceInLS } = useGlobalAppContext()
  const handleSave = useCallback(() => {
    replaceNamespaceInLS({ normalizedData, namespace }, ELSFields.Main)
  }, [normalizedData])
  const handleCancel = useCallback(() => {
    resetForm()
  }, [resetForm])
  const diffs = useMemo(() => getDiffs(data, normalizedData), [data, normalizedData])
  const showDiffs = useMemo(() => Object.keys(diffs).length > 0, [diffs])

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
          onCancel={handleCancel}
          // REST:
          data={data}
          formData={formData}
          onInputChange={handleInputChange}
          normalizedForm={normalizedData}
          formErrors={formErrors}
        />
      )}
      {showDiffs && (
        <div style={{ marginTop: '8px', color: '#ff1744' }}>
          <b>
            <em>Diffs:</em>
          </b>
          <pre style={{ margin: '0px', fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {/* @ts-ignore */}
            {JSON.stringify(diffs, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

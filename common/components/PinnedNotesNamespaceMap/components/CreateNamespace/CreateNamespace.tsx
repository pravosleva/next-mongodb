import { useMemo } from 'react'
import TextField from '@material-ui/core/TextField'
import { useForm, useGlobalAppContext, useNotifsContext } from '~/common/hooks'
import { useStyles } from './styles'

type TForm = {
  newSpaceName: string
  newTitle: string
  newDescription: string
  limit: number
}

const initialState: TForm = {
  newSpaceName: '',
  newTitle: '',
  newDescription: '',
  limit: 5,
}

export const CreateNamespace = () => {
  const classes = useStyles()
  const { addDangerNotif } = useNotifsContext()
  const { formData, handleInputChange, resetForm } = useForm(initialState)
  const hasAnyField = useMemo<boolean>(
    () => !!formData.newSpaceName || !!formData.newTitle || !!formData.newDescription,
    [formData]
  )
  const isFormCorrect = useMemo<boolean>(() => !!formData.newSpaceName && !!formData.newTitle, [
    formData.newSpaceName,
    formData.newTitle,
  ])
  const { createNamespacePromise } = useGlobalAppContext()

  return (
    <div className={classes.formWrapper}>
      <TextField
        size="small"
        label="Namespace"
        required
        type="text"
        // variant="outlined"
        fullWidth
        // placeholder="Namespace"
        name="newSpaceName"
        value={formData.newSpaceName}
        onChange={handleInputChange}
        autoComplete="off"
      />
      <TextField
        size="small"
        label="Title"
        required
        type="text"
        // variant="outlined"
        fullWidth
        // placeholder="Title"
        name="newTitle"
        value={formData.newTitle}
        onChange={handleInputChange}
        autoComplete="off"
      />
      <TextField
        size="small"
        label="Description"
        required
        type="text"
        // variant="outlined"
        fullWidth
        // placeholder="Description"
        name="newDescription"
        value={formData.newDescription}
        onChange={handleInputChange}
        autoComplete="off"
      />
      <TextField
        size="small"
        label="Limit"
        required
        type="number"
        // variant="outlined"
        fullWidth
        // placeholder="Description"
        name="limit"
        value={formData.limit}
        onChange={handleInputChange}
        autoComplete="off"
      />
      {!!isFormCorrect && (
        <button
          onClick={() => {
            createNamespacePromise({
              namespace: formData.newSpaceName,
              title: formData.newTitle,
              description: formData.newDescription,
              limit: !!formData.limit ? Number(formData.limit) : 5,
            })
              .then(resetForm)
              .catch((message: string) => {
                addDangerNotif({ title: 'ERROR: Create namespace', message })
              })
          }}
        >
          Create Namespace
        </button>
      )}
      {hasAnyField && <button onClick={resetForm}>Reset Form</button>}
    </div>
  )
}

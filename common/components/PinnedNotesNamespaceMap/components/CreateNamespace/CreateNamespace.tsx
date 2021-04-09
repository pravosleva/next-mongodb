import { useMemo } from 'react'
import TextField from '@material-ui/core/TextField'
import { useForm, useGlobalAppContext, useNotifsContext } from '~/common/hooks'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import { useStyles } from './styles'
import { TOutputCollapsibleProps } from '~/common/components/CollabsibleContent'

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

export const CreateNamespace = ({ handleClose }: TOutputCollapsibleProps) => {
  const classes = useStyles()
  const { addDangerNotif } = useNotifsContext()
  const { formData, handleInputChange, resetForm } = useForm(initialState)
  const hasAnyField = useMemo<boolean>(
    () => !!formData.newSpaceName.trim() || !!formData.newTitle.trim() || !!formData.newDescription.trim(),
    [formData]
  )
  const isFormCorrect = useMemo<boolean>(() => !!formData.newSpaceName.trim() && !!formData.newTitle.trim(), [
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
        variant="outlined"
        fullWidth
        // placeholder="Namespace"
        name="newSpaceName"
        value={formData.newSpaceName}
        onChange={handleInputChange}
        autoComplete="off"
        autoFocus
      />
      <TextField
        size="small"
        label="Title"
        required
        type="text"
        variant="outlined"
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
        variant="outlined"
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
        <ThemedButton
          color={EColorValue.redNoShadow}
          variant="contained"
          size="small"
          onClick={() => {
            createNamespacePromise({
              namespace: formData.newSpaceName.trim(),
              title: formData.newTitle.trim(),
              description: formData.newDescription.trim(),
              limit: !!formData.limit ? Number(formData.limit) : 5,
            })
              .then(resetForm)
              .then(handleClose)
              .catch((message: string) => {
                addDangerNotif({ title: 'ERROR: Create namespace', message })
              })
          }}
        >
          Create
        </ThemedButton>
      )}
      {hasAnyField && (
        <ThemedButton size="small" color={EColorValue.grey} variant="contained" onClick={resetForm}>
          Clear
        </ThemedButton>
      )}
    </div>
  )
}

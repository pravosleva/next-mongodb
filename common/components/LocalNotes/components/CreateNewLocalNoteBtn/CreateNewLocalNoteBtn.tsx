import { useMemo } from 'react'
import TextField from '@material-ui/core/TextField'
import { useForm, useGlobalAppContext } from '~/common/hooks'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import { useStyles } from './styles'
// import { TOutputCollapsibleProps } from '~/common/components/CollabsibleContent'
// { onClose }: TOutputCollapsibleProps
// import { ELSFields } from '~/common/context/GlobalAppContext'
import Icon from '@mdi/react'
import { mdiContentSave } from '@mdi/js'
import { ELSFields } from '~/common/context'

type TForm = {
  id?: string
  title: string
  description: string
}

const initialState: TForm = {
  title: '',
  description: '',
}

export const CreateNewLocalNoteBtn = ({
  initialStateForEdit,
  onClose,
}: {
  initialStateForEdit?: TForm
  onClose: () => void
}) => {
  const classes = useStyles()
  // const { addDangerNotif } = useNotifsContext()
  const {
    saveLocalNote,
    handleSetAsActiveNote,
    state,
    isPinnedToLS,
    handleUnpinFromLS,
    handlePinToLS,
  } = useGlobalAppContext()
  const activeNote = useMemo(() => state.activeNote, [state.activeNote?._id])

  const { formData, handleInputChange, resetForm } = useForm(initialStateForEdit || initialState)
  // const hasAnyField = useMemo<boolean>(() => !!formData.title.trim() || !!formData.description.trim(), [formData])
  const isFormCorrect = useMemo<boolean>(() => !!formData.title.trim() && !!formData.description.trim(), [
    formData.title,
    formData.description,
  ])

  return (
    <div className={classes.formWrapper}>
      <TextField
        size="small"
        label="Title"
        required
        type="text"
        variant="outlined"
        fullWidth
        // placeholder="Namespace"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        autoComplete="off"
        autoFocus
        helperText={`${50 - formData.title.length} left`}
        InputProps={{ inputProps: { maxLength: 50 } }}
      />
      <TextField
        size="small"
        label="Description"
        required
        type="text"
        variant="outlined"
        fullWidth
        // placeholder="Namespace"
        multiline
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        autoComplete="off"
        // autoFocus
        helperText={
          <span>
            Use{' '}
            <a target="_balnk" href="/notes/5fcaa0ac50f83839dfbcfc12">
              markdown syntax
            </a>{' '}
            ({2000 - formData.description.length} left)
          </span>
        }
        InputProps={{ inputProps: { maxLength: 2000 } }}
      />

      {!!isFormCorrect && (
        <ThemedButton
          color={EColorValue.blueNoShadow}
          variant="contained"
          size="small"
          onClick={() => {
            // cbSuccess
            saveLocalNote({
              id: formData.id || undefined,
              title: formData.title.trim(),
              description: formData.description.trim(),
              cbSuccess: (_arr: any[]) => {
                resetForm()
                onClose()
                if (!!activeNote?._id && !!formData.id) {
                  if (activeNote._id === formData.id) {
                    handleSetAsActiveNote({ ...formData, _id: formData.id, isLocal: true })
                  }
                }
                if (!!formData.id) {
                  isPinnedToLS(formData.id, ELSFields.MainPinnedNamespaceMap)
                    .then((namespace) => {
                      handleUnpinFromLS(formData.id, ELSFields.MainPinnedNamespaceMap)
                      handlePinToLS({ namespace, id: formData.id }, ELSFields.MainPinnedNamespaceMap)
                    })
                    .catch(() => {})
                }
              },
            })
          }}
          endIcon={<Icon path={mdiContentSave} size={0.7} />}
        >
          Save
        </ThemedButton>
      )}
      <ThemedButton
        size="small"
        color={EColorValue.grey}
        variant="contained"
        onClick={() => {
          resetForm()
          onClose()
        }}
      >
        Close
      </ThemedButton>
    </div>
  )
}

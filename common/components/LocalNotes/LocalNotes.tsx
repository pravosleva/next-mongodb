import { useState, useCallback, useMemo } from 'react'
import { useGlobalAppContext } from '~/common/hooks'
import { Badge, CreateNewLocalNoteBtn } from './components'
import { useStyles } from './styles'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import Alert from '@material-ui/lab/Alert'

export const LocalNotes = () => {
  const { localNotes, removeLocalNote, handleSetAsActiveNote } = useGlobalAppContext()
  const classes = useStyles()
  const [isEditorOpened, setIsEditorOpened] = useState<boolean>(false)
  const [editorDefaultState, setEditorDefaultState] = useState<any>({})
  const handleOpen = useCallback(() => {
    setIsEditorOpened(true)
  }, [setIsEditorOpened])
  const handleClose = useCallback(() => {
    setIsEditorOpened(false)
  }, [setIsEditorOpened])
  const handleEdit = useCallback(
    ({ id, title, description }: any) => {
      setEditorDefaultState({ id, title, description })
      handleOpen()
      removeLocalNote(id)
    },
    [handleOpen]
  )
  const hasAnyLocalNote = useMemo(() => localNotes.length > 0, [localNotes])

  return (
    <>
      {!hasAnyLocalNote && (
        <Alert className="info" variant="outlined" severity="info" style={{ marginBottom: '16px' }}>
          Создайте Вашу первую локальную заметку
        </Alert>
      )}
      {isEditorOpened ? (
        Object.keys(editorDefaultState).length > 0 && (
          <div
            style={{
              marginBottom: '8px',
            }}
          >
            <CreateNewLocalNoteBtn initialStateForEdit={editorDefaultState} onClose={handleClose} />
          </div>
        )
      ) : (
        //
        <ThemedButton
          style={{ marginBottom: '8px' }}
          fullWidth
          size="small"
          color={EColorValue.blueNoShadow}
          variant="contained"
          onClick={() => {
            setEditorDefaultState({ title: '', description: '' })
            handleOpen()
          }}
          startIcon={<Icon path={mdiPlus} size={0.7} />}
        >
          Create Local Note
        </ThemedButton>
      )}

      {!!localNotes && localNotes.length > 0 && (
        <div className={classes.badgesList}>
          {localNotes.map(({ id, title, description }) => (
            <Badge
              key={id}
              id={id}
              title={title}
              description={description}
              onEdit={handleEdit}
              showEdit={!isEditorOpened}
              onSetAsActiveNote={(data) => {
                handleSetAsActiveNote({ ...data, _id: id })
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}

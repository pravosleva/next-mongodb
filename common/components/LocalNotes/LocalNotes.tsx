import { useState, useCallback, useMemo } from 'react'
import { useGlobalAppContext } from '~/common/hooks'
import { Badge, CreateNewLocalNoteBtn } from './components'
import { useStyles } from './styles'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import Icon from '@mdi/react'
import { mdiPlus, mdiQrcode } from '@mdi/js'
import { Alert, AlertTitle } from '@material-ui/lab'
import { httpClient } from '~/utils/httpClient'
// import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

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
  const hasAnyLocalNote = useMemo(() => localNotes.length > 0, [localNotes])

  const [qr, setQR] = useState<string | null>(null)
  const resetQR = useCallback(() => {
    setQR(null)
  }, [setQR])
  const handleEdit = useCallback(
    ({ id, title, description }: any) => {
      resetQR()
      setEditorDefaultState({ id, title, description })
      handleOpen()
      removeLocalNote(id)
    },
    [resetQR, setEditorDefaultState, removeLocalNote, handleOpen]
  )
  const [isQRLoading, setIsQRLoading] = useState<boolean>(false)
  // const { addInfoNotif } = useNotifsContext()

  return (
    <>
      {!hasAnyLocalNote && !isEditorOpened && (
        <Alert className="info" variant="outlined" severity="info" style={{ marginBottom: '16px' }}>
          <AlertTitle>Lets try</AlertTitle>
          Локальные заметки не учавствуют в общем поиске
        </Alert>
      )}
      {!qr && (
        <>
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
            <ThemedButton
              style={{ marginBottom: !!localNotes && localNotes.length > 0 ? '8px' : '0px' }}
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
        </>
      )}
      {!!localNotes && localNotes.length > 0 && (
        <>
          {!qr ? (
            <ThemedButton
              style={{ marginBottom: '8px' }}
              fullWidth
              size="small"
              color={EColorValue.grey}
              variant="contained"
              onClick={() => {
                setIsQRLoading(true)
                // addInfoNotif({ message: 'Coming soon...', onRemoval: () => { setIsQRLoading(false) } })
                httpClient
                  .saveMyLocalNotes({ lsData: localNotes })
                  .then(({ qr }) => {
                    setQR(qr)
                  })
                  .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.log(err)
                  })
                  .finally(() => {
                    setIsQRLoading(false)
                  })
              }}
              startIcon={
                isQRLoading ? <CircularProgress color="inherit" size={20} /> : <Icon path={mdiQrcode} size={0.7} />
              }
              disabled={isQRLoading}
            >
              Перенести на др. устройство
            </ThemedButton>
          ) : (
            <>
              <Alert className="info" variant="outlined" severity="success" style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={qr}
                    alt="QR"
                    style={{ width: 164, height: 164, borderRadius: '4px', marginBottom: '8px' }}
                  />
                </div>
                Отсканируйте QR другим устройством
              </Alert>
            </>
          )}
        </>
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
              onDelete={resetQR}
            />
          ))}
        </div>
      )}
    </>
  )
}

import { useState, useCallback, useMemo } from 'react'
import { useGlobalAppContext, useWindowSize } from '~/common/hooks'
import { Badge, CreateNewLocalNoteBtn } from './components'
import { useStyles } from './styles'
import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import Icon from '@mdi/react'
import { mdiPlus, mdiQrcode } from '@mdi/js'
import { Alert } from '@material-ui/lab'
import { httpClient } from '~/utils/httpClient'
// import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useSocketContext } from '~/common/hooks'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
// import CloseIcon from '@material-ui/icons/Close'

export const LocalNotes = () => {
  const { localNotes, removeLocalNote, handleSetAsActiveNote, qr, setQR, resetQR } = useGlobalAppContext()
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

  const handleEdit = useCallback(
    ({ id, title, description, isPrivate = false }: any) => {
      resetQR()
      setEditorDefaultState({ id, title, description, isPrivate })
      handleOpen()
      removeLocalNote(id)
    },
    [resetQR, setEditorDefaultState, removeLocalNote, handleOpen]
  )
  const [isQRLoading, setIsQRLoading] = useState<boolean>(false)
  // const { addInfoNotif } = useNotifsContext()
  const { state } = useSocketContext()

  const theme = useTheme()
  const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { isMobile } = useWindowSize()

  return (
    <>
      {!hasAnyLocalNote && (
        <Alert className="info" variant="outlined" severity="info" style={{ marginBottom: '8px' }}>
          {/* <AlertTitle>Lets try</AlertTitle> */}
          Let's try
        </Alert>
      )}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isEditorOpened}
        fullScreen={isFullScreen}
        // maxWidth="lg"
      >
        <DialogContent style={{ width: isMobile ? '100%' : '400px' }} dividers>
          <CreateNewLocalNoteBtn initialStateForEdit={editorDefaultState} onClose={handleClose} />
        </DialogContent>
      </Dialog>
      {!qr && (
        <>
          {isEditorOpened ? null : ( // ) //   </div> //     <CreateNewLocalNoteBtn initialStateForEdit={editorDefaultState} onClose={handleClose} /> //   > //     }} //       marginBottom: '8px', //     style={{ //   <div // Object.keys(editorDefaultState).length > 0 && (
            <ThemedButton
              style={{ marginBottom: !!localNotes && localNotes.length > 0 ? '8px' : '0px' }}
              fullWidth
              size="small"
              color={EColorValue.blueNoShadow}
              variant="contained"
              onClick={() => {
                setEditorDefaultState({ title: '', description: '', isPrivate: false })
                handleOpen()
              }}
              startIcon={<Icon path={mdiPlus} size={0.7} />}
            >
              Create Local Note
            </ThemedButton>
          )}
        </>
      )}
      <>
        {!qr ? (
          <>
            {!!localNotes && localNotes.length > 0 && (
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
                    .saveMyLocalNotes({
                      lsData: localNotes.filter(({ isPrivate }) => !isPrivate),
                      socketId: state.socketId,
                    })
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
            )}
          </>
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
                  // @ts-ignore
                  src={qr}
                  alt="QR"
                  style={{ width: 196, height: 196, borderRadius: '8px', marginBottom: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '8px' }}>Отсканируйте QR другим устройством</div>
              <ThemedButton
                // style={{ marginBottom: '8px' }}
                fullWidth
                size="small"
                color={EColorValue.grey}
                variant="contained"
                onClick={resetQR}
                // endIcon={<CloseIcon />}
              >
                Сброс
              </ThemedButton>
            </Alert>
          </>
        )}
      </>
      {!!localNotes && localNotes.length > 0 && (
        <div className={classes.badgesList}>
          {localNotes.map(({ id, title, description, isPrivate }) => (
            <Badge
              key={id}
              id={id}
              title={title}
              description={description}
              isPrivate={isPrivate}
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

import { Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
// import { makeStyles, createStyles } from '@mui/styles'

type TProps = {
  resetErrorBoundary: () => void
  error: Error
}

export const ErrorFallback = ({ error, resetErrorBoundary }: TProps) => {
  // const classes = useStyles()
  const { message } = error

  return (
    <Alert variant="outlined" severity="error" title="Oops">
      <div>
        <div>{message}</div>
        <Button size='small' autoFocus onClick={resetErrorBoundary} variant='outlined' color="primary">
          Try again
        </Button>
      </div>
    </Alert>
  )
}

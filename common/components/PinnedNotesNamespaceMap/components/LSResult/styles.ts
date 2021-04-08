import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      border: '1px dashed red',
      '& > *:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
    },
  })
)

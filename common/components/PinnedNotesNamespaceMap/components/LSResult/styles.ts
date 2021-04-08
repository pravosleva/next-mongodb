import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      // border: '1px dashed red',
      '& > *:not(:last-child)': {
        marginBottom: theme.spacing(2),
      },
    },
  })
)

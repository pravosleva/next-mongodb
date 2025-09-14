import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      // border: '1px dashed red',
      // '& > .search': { marginBottom: theme.spacing(2) },
      display: 'flex',
      flexDirection: 'column',
      '& > div:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
    },
  })
)

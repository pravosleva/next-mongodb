import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      marginBottom: '0px',
      '& li:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
    },
    badge: {
      fontSize: '12px',
      padding: theme.spacing(1),
      backgroundColor: 'transparent',
      borderRadius: theme.spacing(1),
      transition: 'all 0.2s linear',
      '&:hover': {
        // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.1), 0 -8px 6px -6px rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
    },
  })
)

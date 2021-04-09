import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      marginBottom: '0px',

      [theme.breakpoints.up('md')]: {
        '& li:not(:last-child)': {
          marginBottom: theme.spacing(1),
        },
      },
      [theme.breakpoints.down('sm')]: {
        '& li:not(:last-child)': {
          marginBottom: '1px',
        },
      },
    },
    badge: {
      fontSize: '12px',
      padding: theme.spacing(1),
      backgroundColor: 'transparent',
      borderRadius: theme.spacing(1),
      transition: 'all 0.2s linear',
      '&:hover': {
        // borderBottom: '1px solid white',
        // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.1), 0 -8px 6px -6px rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
    },
    defaultBadge: {},
    defaultPrivate: {},
    activeDefault: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFF !important',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        // opacity: 0.7,
      },
    },
    activePrivate: {
      backgroundColor: '#f44336',
      color: '#FFF !important',
      '&:hover': {
        backgroundColor: '#f44336',
        // opacity: 0.7,
      },
    },
  })
)

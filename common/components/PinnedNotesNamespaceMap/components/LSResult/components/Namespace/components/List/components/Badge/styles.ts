// import { red } from '@material-ui/core/colors'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      cursor: 'pointer',
      fontSize: '12px',
      padding: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        borderRadius: '4px',
      },
      [theme.breakpoints.down('sm')]: {
        // borderRadius: '4px 0px 0px 4px',
        borderRadius: 0,
      },

      transition: 'all 0.2s linear',
      backgroundColor: 'rgba(0,0,0,0.05)',
      '&:hover': {
        // borderBottom: '1px solid white',
        // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.1), 0 -8px 6px -6px rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)',
        // opacity: 0.7,
      },
    },
    truncate: {
      whiteSpace: 'nowrap',
      width: '100%', // IE6 needs any width
      overflow: 'hidden', // "overflow" value must be different from  visible"
      // -o-text-overflow: 'ellipsis // Opera < 11
      textOverflow: 'ellipsis', // IE, Safari (WebKit), Opera >= 11, FF > 6
    },
    defaultBadge: {},
    defaultPrivate: {
      backgroundColor: '#ffbf69', // Orange
      color: 'inherit',
      '&:hover': {
        backgroundColor: '#ff8e53',
        color: '#FFF',
        // opacity: 0.7,
      },
    },
    defaultNotPrivate: {
      // backgroundColor: theme.palette.primary.main,
      backgroundColor: 'rgba(0,0,0,0.05)',
      color: 'inherit',
    },
    activeDefault: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFF !important',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        // opacity: 0.7,
      },
    },
    activePrivate: {
      // backgroundColor: '#f44336',
      backgroundColor: '#ff8e53', // Orange
      color: '#FFF !important',
      '&:hover': {
        // backgroundColor: '#f44336',
        backgroundColor: '#ff8e53',
        // opacity: 0.75,
      },
    },
  })
)

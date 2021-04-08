// import { red } from '@material-ui/core/colors'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      cursor: 'pointer',
      fontSize: '12px',
      padding: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        borderRadius: '8px',
      },
      [theme.breakpoints.down('sm')]: {
        borderRadius: '8px 0px 0px 8px',
      },

      transition: 'all 0.2s linear',
      backgroundColor: 'rgba(0,0,0,0.1)',
      '&:hover': {
        // borderBottom: '1px solid white',
        // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.1), 0 -8px 6px -6px rgba(0,0,0,0.1)',
        // backgroundColor: 'rgba(0,0,0,0.2)',
        opacity: 0.9,
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
    },
    defaultNotPrivate: {
      // backgroundColor: theme.palette.primary.main,
      backgroundColor: 'rgba(0,0,0,0.1)',
      color: 'inherit',
    },
    activeDefault: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFF !important',
      '&:hover': {
        // backgroundColor: 'rgba(0,0,0,0.1)',
        // opacity: 0.7,
      },
    },
    activePrivate: {
      // backgroundColor: '#f44336',
      backgroundColor: '#ff8e53', // Orange
      color: '#FFF !important',
      '&:hover': {
        // backgroundColor: '#f44336',
        // opacity: 0.7,
      },
    },
  })
)

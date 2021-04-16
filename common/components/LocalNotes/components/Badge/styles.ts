// import { red } from '@material-ui/core/colors'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      borderRadius: '4px',

      display: 'flex',
      flexDirection: 'row',
    },
    badgeContent: {
      cursor: 'pointer',
      fontSize: '13px',
      transition: 'all 0.2s linear',
      backgroundColor: 'rgba(0,0,0,0.05)',
      '&:hover': {
        // borderBottom: '1px solid white',
        // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.1), 0 -8px 6px -6px rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)',
        // opacity: 0.7,
      },

      padding: theme.spacing(1),
      borderRadius: '4px 0 0 4px',
    },
    truncate: {
      whiteSpace: 'nowrap',
      width: '100%', // IE6 needs any width
      overflow: 'hidden', // "overflow" value must be different from  visible"
      // -o-text-overflow: 'ellipsis // Opera < 11
      textOverflow: 'ellipsis', // IE, Safari (WebKit), Opera >= 11, FF > 6
    },
    editButton: {
      cursor: 'pointer',
      padding: theme.spacing(1),
      borderRadius: 0,
      // backgroundColor: 'rgba(25, 133, 123, 0.5)',
      backgroundColor: 'rgba(0,0,0,0.05)',
      // backgroundColor: 'transparent',
      // color: theme.palette.primary.main,
      color: 'gray',
      '&:hover': {
        // backgroundColor: 'rgba(25, 133, 123, 0.65)',
        backgroundColor: theme.palette.primary.main,
        color: '#FFF',
      },

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButton: {
      cursor: 'pointer',
      color: '#FFF',
      padding: theme.spacing(1),
      borderRadius: '0 4px 4px 0',
      background: 'linear-gradient(45deg, #e63946 30%, #fe7f2d 90%)',
      '&:hover': {
        background: 'linear-gradient(0deg, #e63946 10%, #fe7f2d 110%)',
      },

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    defaultBadge: {},
    defaultNotPrivate: {
      // backgroundColor: theme.palette.primary.main,
      backgroundColor: 'rgba(0,0,0,0.05)',
      color: 'inherit',
    },
    activeDefault: {
      backgroundColor: theme.palette.primary.main,
      '& > *': {
        color: '#FFF',
        // '&:hover': {},
      },
      color: '#FFF !important',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        // opacity: 0.7,
      },
    },
  })
)

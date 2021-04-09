import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const widgetWidthDesktop = 500
const widgetWidthMobile = 280
// const widgetTogglerWidthDesktop = 160
// const widgetTogglerWidthMobile = 160
const offsetTop = {
  md: 90,
  sm: 56,
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iframe: {
      border: 'none',

      width: '100%',
      [theme.breakpoints.up('md')]: {
        height: '400px',
      },
      [theme.breakpoints.down('sm')]: {
        height: '200px',
      },
    },
    buttonsWrapper: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
        '& > button:not(:last-child)': {
          marginRight: theme.spacing(1),
        },
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        justifyContent: 'center',
        '& > button:not(:last-child)': {
          marginBottom: theme.spacing(1),
        },
      },
    },
    circularProgressCentered: {
      display: 'flex',
      justifyContent: 'center',
    },

    // Widget:
    widgetPaper: {
      padding: theme.spacing(1),
      backgroundColor: '#FFF',
      [theme.breakpoints.up('md')]: {
        width: `${widgetWidthDesktop}px`,
      },
      [theme.breakpoints.down('sm')]: {
        width: `${widgetWidthMobile}px`,
      },
      borderRadius: '0 0 0 4px',

      position: 'relative',
    },
    fixedDesktopWidget: {
      position: 'fixed',
      [theme.breakpoints.up('md')]: {
        top: `${offsetTop.md}px`,
        transform: `translateX(${widgetWidthDesktop}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        top: `${offsetTop.sm}px`,
        transform: `translateX(${widgetWidthMobile}px)`,
      },
      right: '0px',
      transition: 'transform 0.2s linear',
      zIndex: 6,
    },
    openedWidget: {
      transform: 'translateX(0px)',
    },
    widgetTogglerBtn: {
      // --- Like smartprice
      cursor: 'pointer',
      color: '#202020',
      backgroundColor: '#FCBF2C',
      border: '1px solid #FCBF2C',
      '&:hover': {
        backgroundColor: '#FCBF2C',
        color: '#202020',
        border: '1px solid #FCBF2C',
        // boxShadow: '0px 14px 30px -8px rgba(198, 143, 15, 0.6)',
        boxShadow: 'none',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: '#E6EAF0',
        color: '#B8BDCE',
      },
      // ---

      marginRight: '0px !important',
      position: 'absolute',
      top: '0px',
      right: '0px',
      boxShadow: 'none',

      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      [theme.breakpoints.up('md')]: {
        // width: `${widgetTogglerWidthDesktop}px`,
        // left: `-${widgetTogglerWidthDesktop}px`,
        transform: `translateX(-${widgetWidthDesktop}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        // width: `${widgetTogglerWidthMobile}px !important`,
        // minWidth: `${widgetTogglerWidthMobile}px`,
        // left: `-${widgetTogglerWidthMobile}px`,
        transform: `translateX(-${widgetWidthMobile}px)`,
      },

      // '&:hover': {},
      '&:focus': {
        boxShadow: 'none',
      },
    },
    heightLimit: {
      [theme.breakpoints.up('md')]: {
        maxHeight: `calc(100vh - ${offsetTop.md}px - ${offsetTop.md}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        maxHeight: `calc(100vh - ${offsetTop.sm}px - ${offsetTop.sm}px)`,
      },
      // border: '1px dashed red',
      // padding: theme.spacing(2, 0, 2, 0),
      overflowY: 'auto',
    },
    insetShadow: {
      // boxShadow: 'inset 0 -10px 10px -10px rgba(0,0,0,0.1)',
    },
  })
)

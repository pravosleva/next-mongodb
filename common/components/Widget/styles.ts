import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const widgetWidthDesktop = 350
const widgetWidthMobile = '100vw'
// const widgetTogglerWidthDesktop = 160
// const widgetTogglerWidthMobile = 160
const offsetTop = {
  md: 90,
  sm: 150,
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
    absCloseBtn: {
      position: 'fixed',
      top: '16px',
      right: '14px',
      zIndex: 7,
      width: '35px',
      height: '35px',
      border: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      backgroundColor: '#586274',
      color: '#FFF',
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
      // padding: theme.spacing(1),
      backgroundColor: '#FFF',
      [theme.breakpoints.up('md')]: {
        width: `${widgetWidthDesktop}px`,
      },
      [theme.breakpoints.down('sm')]: {
        width: widgetWidthMobile,
        // width: '100wh',
      },

      position: 'relative',
    },
    fixedDesktopWidget: {
      // border: '1px solid red',
      position: 'fixed',
      transition: 'transform 0.2s linear',
      zIndex: 6,
    },
    right: {
      '& .paper': {
        borderRadius: '0 0 0 4px',
      },
      [theme.breakpoints.up('md')]: {
        // top: `${offsetTop.md}px`,
        top: 0,
        transform: `translateX(${widgetWidthDesktop}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        // top: `${offsetTop.sm}px`,
        top: 0,
        transform: `translateX(${widgetWidthMobile})`,
        // transform: 'translateX(100wh)',
      },
      right: '0px',
      '& .widget-toggler-btn': {
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

        // marginRight: '0px !important',
        position: 'absolute',
        top: '0px',
        boxShadow: 'none',

        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',

        // '&:hover': {},
        '&:focus': {
          boxShadow: 'none',
        },
        right: '0px',
        [theme.breakpoints.up('md')]: {
          top: `${offsetTop.md}px`,
          // width: `${widgetTogglerWidthDesktop}px`,
          // left: `-${widgetTogglerWidthDesktop}px`,
          transform: `translateX(-${widgetWidthDesktop}px)`,
        },
        [theme.breakpoints.down('sm')]: {
          top: `${offsetTop.sm}px`,
          // width: `${widgetTogglerWidthMobile}px !important`,
          // minWidth: `${widgetTogglerWidthMobile}px`,
          // left: `-${widgetTogglerWidthMobile}px`,

          transform: `translateX(-${widgetWidthMobile})`,
          // transform: 'translateX(-100wh)',
        },
      },
    },
    hidden: {
      display: 'none',
    },
    left: {
      '& .paper': {
        borderRadius: '0 0 4px 0',
      },
      [theme.breakpoints.up('md')]: {
        // top: `${offsetTop.md}px`,
        top: 0,
        transform: `translateX(-${widgetWidthDesktop}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        // top: `${offsetTop.sm}px`,
        top: 0,
        transform: `translateX(-${widgetWidthMobile})`,
        // transform: 'translateX(-100wh)',
      },
      left: '0px',
      '& .widget-toggler-btn': {
        // border: '1px solid red',
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

        // marginRight: '0px !important',
        position: 'absolute',
        // top: '0px',
        boxShadow: 'none',

        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',

        // '&:hover': {},
        '&:focus': {
          boxShadow: 'none',
        },
        left: '0px',
        [theme.breakpoints.up('md')]: {
          bottom: `${offsetTop.md}px`,
          // width: `${widgetTogglerWidthDesktop}px`,
          // left: `-${widgetTogglerWidthDesktop}px`,
          transform: `translateX(${widgetWidthDesktop}px)`,
        },
        [theme.breakpoints.down('sm')]: {
          bottom: `${offsetTop.sm}px`,
          // width: `${widgetTogglerWidthMobile}px !important`,
          // minWidth: `${widgetTogglerWidthMobile}px`,
          // left: `-${widgetTogglerWidthMobile}px`,

          transform: `translateX(${widgetWidthMobile})`,
          // transform: 'translateX(100wh)',
        },
      },
    },
    openedWidget: {
      transform: 'translateX(0px)',
    },
    heightLimit: {
      maxHeight: '100dvh',
      [theme.breakpoints.up('md')]: {
        // maxHeight: `calc(100dvh - ${offsetTop.md}px - ${offsetTop.md}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        // maxHeight: `calc(100dvh - ${offsetTop.sm}px - ${offsetTop.sm}px)`,
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

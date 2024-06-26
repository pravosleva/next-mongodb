import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const sidebarWidth = 300

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    minimalHeightSetting: {
      // border: '1px solid red',
      [theme.breakpoints.up('sm')]: {
        minHeight: 'calc(100vh - 69px)',

        // NOTE: Height limit
        maxHeight: 'calc(100vh - 69px)',
        overflow: 'auto',
      },
      [theme.breakpoints.down('xs')]: {
        minHeight: 'calc(100vh - 56px)',
      },
    },
    forExample: {
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
    },
    contentBox: {
      // border: '1px solid red',
      display: 'flex',
      // boxSizing: 'border-box',
      // [theme.breakpoints.up('md')]: {
      //   width: `calc(100% - ${sidebarWidth}px)`,
      // },
      '& > div': {
        // width: '100%',
        [theme.breakpoints.up('md')]: {
          width: `calc(100% - 300px - 8px)`,
        },
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
      },
      minHeight: 'inherit',
      flexDirection: 'row',
      '& > div:first-child': {
        [theme.breakpoints.up('xl')]: {
          width: `calc(100% - ${sidebarWidth}px)`,
          minWidth: `calc(100% - ${sidebarWidth}px)`,
          maxWidth: `calc(100% - ${sidebarWidth}px)`,
        },
        // [theme.breakpoints.down('md')]: {
        //   width: '70%',
        //   minWidth: '70%',

        //   // margin: '20px 0px 50px 0px',
        // },
        [theme.breakpoints.down('md')]: {
          width: '100%',
          // minWidth: '100%',

          // margin: '20px 0px 50px 0px',
        },
      },
    },
    sidebarInLayoutWrapper: {
      borderLeft: '1px solid lightgray',
      // NOTE: See also: https://css-tricks.com/gradient-borders-in-css/
      borderImage: 'linear-gradient(to bottom, lightgray, transparent) 1 100%',
      padding: theme.spacing(2, 0, 1, 0),
      margin: theme.spacing(0, 0, 0, 1),

      overflowY: 'auto',
      maxHeight: 'calc(100vh - 69px)',
      position: 'sticky',
      top: 0,
      boxSizing: 'border-box',
      width: `${sidebarWidth}px`,
      minWidth: `${sidebarWidth}px`,
      maxWidth: `${sidebarWidth}px`,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
      // border: '1px solid red',
    },
  })
)

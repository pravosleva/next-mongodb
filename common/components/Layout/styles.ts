import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    minimalHeightSetting: {
      [theme.breakpoints.up('sm')]: {
        minHeight: 'calc(100vh - 64px)',
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
      display: 'flex',
      width: '100%',
      minHeight: 'inherit',
      flexDirection: 'row',
      '& > div:first-child': {
        margin: '20px 0px 50px 0px',
      },
    },
    sidebarInLayoutWrapper: {
      borderLeft: '1px solid lightgray',
      // NOTE: See also: https://css-tricks.com/gradient-borders-in-css/
      borderImage: 'linear-gradient(to bottom, lightgray, transparent) 1 100%',
      padding: theme.spacing(8, 0, 1, 1),
      margin: theme.spacing(0, 0, 0, 1),

      overflowY: 'auto',
      maxHeight: 'calc(100vh - 64px)',
      position: 'sticky',
      top: 0,
      width: '200px',
      minWidth: '200px',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  })
)

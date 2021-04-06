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
    sidebar: {
      border: '1px dashed red',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 64px)',
      position: 'sticky',
      top: 0,
      width: '200px',
      marginLeft: theme.spacing(1),
      padding: theme.spacing(1, 0, 1, 0),
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  })
)

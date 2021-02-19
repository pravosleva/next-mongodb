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
  })
)

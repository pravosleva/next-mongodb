import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((_theme) => ({
  // tst: {
  //   [theme.breakpoints.up('md')]: {},
  //   [theme.breakpoints.down('sm')]: {},
  // },
  dialogWrapper: {
    '& > div > div': {
      backgroundColor: 'transparent !important',
      boxShadow: 'none',
    },
  },
  dialogContent: {
    // border: '1px solid red',
    // margin: '0 auto',
    backgroundColor: 'transparent',
  },
  dialogTitle: {
    '& > h2': {
      display: 'flex',
      width: '100%',
    },
  },
  closeIcon: {
    marginLeft: 'auto',
  },
}))

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      '& > *:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
      '& > div.collapsible-wrapper:last-child > div': {
        marginBottom: '0px !important',
      },
    },
    collapsibleWrapper: {
      '& > div:not(:last-child)': {
        marginBottom: '4px !important',
      },
      '& > div': {
        marginTop: '0px',
      },
    },
    btnsWrapper: {
      '& > button': {
        marginBottom: theme.spacing(1),
      },
    },
  })
)

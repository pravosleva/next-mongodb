import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      '& > .search': { marginBottom: theme.spacing(2) },
      display: 'flex',
      flexDirection: 'column',
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
  })
)

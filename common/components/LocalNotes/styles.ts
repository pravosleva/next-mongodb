// import { red } from '@material-ui/core/colors'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badgesList: {
      // '& > div:not(:last-child)': {
      '& > div': {
        marginBottom: theme.spacing(1),
      },
    },
  })
)

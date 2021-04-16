import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { theme } from '~/common/styled-mui/theme'

export const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    formWrapper: {
      '& em': {
        color: 'grey',
      },
      display: 'flex',
      flexDirection: 'column',
      '& > *:not(:last-child)': {
        marginBottom: theme.spacing(1),
      },
      '& .info': {
        marginBottom: theme.spacing(2),
      },
    },
  })
)

import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((_theme) => ({
  collapsible: {
    '& > input[type=checkbox]:not(:checked) ~ .content': {
      maxHeight: '0',
      visibility: 'hidden',
    },
  },
  noMarginBottomForLastChild: {
    '> *:last-child': {
      marginBottom: 0,
    },
  },
}))

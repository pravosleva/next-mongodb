import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginBottom: theme.spacing(2),
  },
  titleBox: {
    cursor: 'pointer',
    '&:hover': {
      color: '#3882C4',
    },

    display: 'flex',
    flexDirection: 'row',
    '& > div:not(:last-child)': {
      marginRight: '10px',
    },
  },
  marginBottomIfOpened: {
    marginBottom: theme.spacing(1),
  },
}))

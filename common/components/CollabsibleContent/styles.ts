import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  titleBox: {
    cursor: 'pointer',
    '&:hover': {
      color: '#3882C4',
    },
  },
  titleBoxLeft: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    '& > div:not(:last-child)': {
      marginRight: '10px',
    },
  },
  titleBoxRight: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    '& > div:not(:first-child)': {
      marginLeft: '10px',
    },
  },
  marginBottomIfOpened: {
    marginBottom: theme.spacing(1),
  },
}))

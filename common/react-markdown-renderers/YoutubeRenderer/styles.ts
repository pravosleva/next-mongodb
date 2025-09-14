import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  reactYoutubeContainer: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9
    height: '0',
    overflow: 'hidden',
    backgroundColor: '#000',
    [theme.breakpoints.down('md')]: {
      borderRadius: '0px',
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: '8px',
    },
  },
  reactYoutube: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  },

  externalWrapper: {
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      maxWidth: '850px',
    },
    marginBottom: '8px',
  },
}))

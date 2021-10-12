import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    wrapper: {
      fontSize: '13px',
      border: '2px solid #2D3748',
      borderRadius: '8px',
      padding: '5px',
      // boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#2D3748',
      color: '#FFF',
      '& pre': {
        marginBottom: '0px !important',
        whiteSpace: 'pre-wrap',
      },
    },
  })
)

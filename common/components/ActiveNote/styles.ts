import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    truncate: {
      whiteSpace: 'nowrap',
      width: '100%', // IE6 needs any width
      overflow: 'hidden', // "overflow" value must be different from  visible"
      // -o-text-overflow: 'ellipsis // Opera < 11
      textOverflow: 'ellipsis', // IE, Safari (WebKit), Opera >= 11, FF > 6
      '& h2': {
        whiteSpace: 'nowrap',
        width: '100%', // IE6 needs any width
        overflow: 'hidden', // "overflow" value must be different from  visible"
        // -o-text-overflow: 'ellipsis // Opera < 11
        textOverflow: 'ellipsis', // IE, Safari (WebKit), Opera >= 11, FF > 6
      },
    },

    timeSectionWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // minHeight: '50px',
      marginBottom: theme.spacing(1),
      color: 'lightgray',
    },
    serviceCodeSectionWrapper: {
      width: '100%',
      '& > pre': {
        margin: '0px !important',
      },
    },
  })
)

import { makeStyles, createStyles } from '@material-ui/core/styles'
import Pagination from '@material-ui/lab/Pagination'

const useStyles = makeStyles((_theme) =>
  createStyles({
    root: {
      // '& > *': { marginTop: theme.spacing(2) },
    },
  })
)

export const Sample0 = (defaulProps: any) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Pagination
        // shape="round"
        size="small"
        {...defaulProps}
        showLastButton={false}
        showFirstButton={false}
        siblingCount={3}
        boundaryCount={5}
      />
    </div>
  )
}

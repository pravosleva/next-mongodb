import { makeStyles, createStyles } from '@material-ui/core/styles'
import Pagination from '@material-ui/lab/Pagination'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  })
)

export const Sample0 = (defaulProps: any) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Pagination count={10} shape="rounded" {...defaulProps} />
      {/* <Pagination count={10} variant="outlined" shape="rounded" /> */}
    </div>
  )
}

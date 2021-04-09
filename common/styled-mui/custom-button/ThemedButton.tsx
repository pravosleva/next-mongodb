import { withStyles, WithStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { EColorValue } from './interfaces'

interface Styles {
  color: EColorValue
  children: React.ReactNode
  [key: string]: any
}
interface ColorsMapping {
  [key: string]: string
}
interface ButtonStyles extends WithStyles<typeof styles> {
  color: EColorValue
}

// Like https://github.com/brunobertolini/styled-by
const styledBy = (property: string, mapping: ColorsMapping) => (props: Styles) => mapping[props[property]]

const styles = {
  root: {
    background: styledBy('color', {
      [EColorValue.default]: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      [EColorValue.blue]: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      [EColorValue.red]: 'linear-gradient(45deg, #e63946 30%, #fe7f2d 90%)',
      [EColorValue.grey]: 'lightgrey',
      [EColorValue.redNoShadow]: 'linear-gradient(45deg, #e63946 30%, #fe7f2d 90%)',
    }),
    transition: 'all 0.2s linear',
    // borderRadius: 3,
    // border: 0,
    color: 'white',
    // height: 48,
    // padding: '0 30px',
    boxShadow: styledBy('color', {
      [EColorValue.default]: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      [EColorValue.blue]: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      [EColorValue.red]: '0 3px 5px 2px rgba(230, 57, 70, .3)',
      [EColorValue.grey]: 'none',
      [EColorValue.redNoShadow]: 'none',
    }),
    '&:hover': {
      background: styledBy('color', {
        [EColorValue.default]: 'linear-gradient(0deg, #FE6B8B 10%, #FF8E53 110%)',
        [EColorValue.blue]: 'linear-gradient(0deg, #2196F3 10%, #21CBF3 110%)',
        [EColorValue.red]: 'linear-gradient(0deg, #e63946 10%, #fe7f2d 110%)',
        [EColorValue.grey]: 'darkgrey',
        [EColorValue.redNoShadow]: 'linear-gradient(0deg, #e63946 10%, #fe7f2d 110%)',
      }),
      boxShadow: styledBy('color', {
        [EColorValue.default]: '0 3px 5px 2px rgba(255, 105, 135, .5)',
        [EColorValue.blue]: '0 3px 5px 2px rgba(33, 203, 243, .5)',
        [EColorValue.red]: '0 0px 8px 2px rgba(230, 57, 70, .5)',
        [EColorValue.grey]: 'none',
        [EColorValue.redNoShadow]: 'none',
      }),
    },
  },
}

export const ThemedButton = withStyles(styles)(({ classes, color, ...other }: ButtonStyles) => (
  <Button className={classes.root} {...other} />
))

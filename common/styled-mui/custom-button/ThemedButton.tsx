import { withStyles, WithStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

type TColorValue = 'default' | 'blue' | 'red'
interface Styles {
  color: TColorValue
  children: React.ReactNode
  [key: string]: any
}
interface ColorsMapping {
  default: string
  blue: string
  red: string
  [key: string]: any
}
interface ButtonStyles extends WithStyles<typeof styles> {
  color: TColorValue
}

// Like https://github.com/brunobertolini/styled-by
const styledBy = (property: string, mapping: ColorsMapping) => (props: Styles) => mapping[props[property]]

const styles = {
  root: {
    background: styledBy('color', {
      default: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      blue: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      red: 'linear-gradient(45deg, #e63946 30%, #fe7f2d 90%)',
    }),
    transition: 'box-shadow 0.3s linear',
    // borderRadius: 3,
    // border: 0,
    color: 'white',
    // height: 48,
    // padding: '0 30px',
    boxShadow: styledBy('color', {
      default: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      blue: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      red: '0 3px 5px 2px rgba(230, 57, 70, .3)',
    }),
    '&:hover': {
      background: styledBy('color', {
        default: 'linear-gradient(0deg, #FE6B8B 10%, #FF8E53 110%)',
        blue: 'linear-gradient(0deg, #2196F3 10%, #21CBF3 110%)',
        red: 'linear-gradient(0deg, #e63946 10%, #fe7f2d 110%)',
      }),
      boxShadow: styledBy('color', {
        default: '0 3px 5px 2px rgba(255, 105, 135, .5)',
        blue: '0 3px 5px 2px rgba(33, 203, 243, .5)',
        red: '0 0px 8px 2px rgba(230, 57, 70, .5)',
      }),
    },
  },
}

export const ThemedButton = withStyles(styles)(({ classes, color, ...other }: ButtonStyles) => (
  <Button className={classes.root} {...other} />
))

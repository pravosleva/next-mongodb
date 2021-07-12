import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 1150,
    lg: 1280,
    xl: 1920,
  },
}
export const defaultTheme = {
  breakpoints,
  common: {
    white: '#FFF',
  },
  palette: {
    primary: {
      main: '#3882C4',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },

  typography: {
    // fontSize: '0.95rem',
    // htmlFontSize: '0.95rem',
  },
  // [theme.breakpoints.up('md')]: {
  //   // htmlFontSize: 10,
  //   typography: { fontSize: '1rem !important' },
  // },
  // [theme.breakpoints.down('xs')]: {},

  overrides: {
    // MuiPaper: {
    //   root: {
    //     backgroundColor: '#FFF !important',
    //   },
    // },
    // MuiCssBaseline: {
    //   '@global': {
    //     // '@font-face': ['Fira Sans'],
    //   },
    //   body: {
    //     'overflow-x': 'hidden',
    //   },
    // },
    MuiSelect: {
      root: {
        borderRadius: '8px',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '8px',
      },
    },
    MuiButton: {
      root: {
        borderRadius: '8px',
      },
      outlined: {
        backgroundColor: '#FFF',
        '& :hover': {
          backgroundColor: 'rgba(255,255,255,0.5)',
        },
        // border: '1px solid dimgray',
      },
    },
  },
}

const {
  values: { xs, sm, md, lg, xl },
} = breakpoints

export { xl, lg, md, sm, xs }

// Create a theme instance.
export const theme = createMuiTheme(defaultTheme)

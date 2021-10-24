import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 1150,
    // lg: 1280,
    xl: 1920,
    // md: 1300,
    lg: 1480,
    // xl: 1920,
  },
}
export const defaultTheme = {
  breakpoints,
  common: {
    white: '#FFF',
  },
  palette: {
    primary: {
      // main: '#3882C4',
      main: '#2d3748',
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
    MuiAlert: {
      root: {
        borderRadius: '8px',
      },
    },
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
        // borderWidth: '2px !important',
      },
      outlined: {
        borderColor: '#D0D0D0',
        backgroundColor: '#FFF !important',
        '&:hover': {
          borderColor: '#A9A9A9',
          // backgroundColor: 'rgba(255,255,255,0.5)',
        },
      },
    },
    MuiPagination: {
      root: {
        '& > ul > li': {
          padding: '0 4px 8px 4px',
        },
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

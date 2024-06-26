import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      // border: '1px dashed red',
      '& > .ReactGridGallery > div': {
        gap: '8px',
      },
      '& > .ReactGridGallery img': {
        maxWidth: '100%',
      },
    },

    srLWrapperLayout: {
      // border: '1px solid red',
      // display: 'flex',
      // flexWrap: 'wrap',

      // GRID:
      display: 'grid',
      columnGap: '8px',
      rowGap: '8px',

      // @ts-ignore
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
      },
      // @ts-ignore
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        '& div:last-child': {
          // maxWidth: '33%',
        },
      },
      gridAutoFlow: 'dense',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

      '& > img': {
        // border: '1px dashed red',
        height: '200px',
        width: '100%',
        objectFit: 'cover',

        borderRadius: '8px',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        cursor: 'pointer',
      },
    },
  })
)

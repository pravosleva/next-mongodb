import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

export const useBaseStyles = makeStyles((theme: Theme) =>
  createStyles({
    noPaddingMobile: {
      [theme.breakpoints.down('sm')]: {
        padding: '0px',
      },
      // [theme.breakpoints.up('md')]: {
      //   maxWidth: '1100px',
      // },
    },
    btnsBox: {
      // margin: theme.spacing(1, 0, 1, 0),

      width: '100%',
      // maxWidth: '700px',
      // margin: '0 auto',
      display: 'grid',
      justifyContent: 'center',
      // '& > button': {
      //   // maxWidth: '200px',
      //   borderRadius: '0px',
      // },
      // '& > button:first-child': {
      //   // maxWidth: '200px',
      //   borderRadius: '8px 0 0 8px',
      // },
      // '& > button:last-child': {
      //   // maxWidth: '200px',
      //   borderRadius: '0 8px 8px 0',
      // },
      gridGap: theme.spacing(1),
      // gridGap: '0px',

      // border: '1px solid red',

      [theme.breakpoints.only('xs')]: {
        padding: theme.spacing(1),
        gridTemplateColumns: 'repeat(2,1fr)',
      },
      [theme.breakpoints.only('sm')]: {
        padding: theme.spacing(1),
        gridTemplateColumns: 'repeat(4,1fr)',
      },
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(1, 0, 1, 0),
        gridTemplateColumns: 'repeat(5,1fr)',
      },
      [theme.breakpoints.only('lg')]: {
        padding: theme.spacing(1, 0, 1, 0),
        gridTemplateColumns: 'repeat(5,1fr)',
      },
    },
    standardMobileResponsiveBlock: {
      // [theme.breakpoints.down('sm')]: {
      //   padding: theme.spacing(1, 0, 1, 0),
      // },
      // [theme.breakpoints.up('md')]: {
      //   padding: theme.spacing(1, 0, 1, 0),
      // },
    },
    noMarginTopBottomMobile: {
      [theme.breakpoints.down('sm')]: {
        marginTop: '0px',
        marginBottom: '0px',
      },
    },

    // Customizable listing wrapper:
    customizableListingWrapper: {
      // paddingTop: 0,
      '& ul': {
        // border: '1px solid red',
        // listStyleImage: 'url(/static/svg/yellow-dot.svg)',
        listStyle: 'outside',
        listStyleType: "'✪'", // 'disc',
        '& > li::marker': {
          // transform: 'translateY(-2px)',
          color: '#4183c4',
          // content: '✪',
        },
      },

      '& ul, ol': {
        '& > li': {
          // lineHeight: '25px',
          marginBottom: '5px',
          paddingLeft: '5px',
          '& > p': {
            display: 'inline',
          },
          '& > blockquote': {
            marginTop: '0px !important',
            marginBottom: '0px !important',
          },
          '& input[type="checkbox"]': {
            // display: 'block',
            // transform: 'translateY(-50%)',
            [theme.breakpoints.down('sm')]: {
              transform: 'translateY(25%)',
            },
            // marginBottom: '10px',
          },
        },
        // '& > li:not(:last-child)': {
        //   marginBottom: '15px',
        // },
      },

      /*
      '& .internal-block': {
        [theme.breakpoints.up('md')]: {
          marginLeft: '22px',
        },
        [theme.breakpoints.down('sm')]: {
          marginLeft: '0px',
        },
      },
      '& .inline-padded-elm': {
        display: 'block',
        width: '100%',
        marginBottom: '20px',
      },

      '& ul, ol': {
        '& > li:not(:last-child)': {
          marginBottom: '10px',
        },
      },
      '& ol': {
        maxWidth: '100%',
        paddingLeft: 0,
        marginTop: 0,
        listStyle: 'none',
        counterReset: 'myCounter',
        // '& > li:not(:last-child)': {marginBottom: '10px' },
        '& > li::before': {
          counterIncrement: 'myCounter',
          content: "counter(myCounter) '.'",
          color: 'inherit',
          display: 'inline-block',
          textAlign: 'center',
          margin: '0 15px 0 0',
          lineHeight: '40px',
          // width: '10px',
          minWidth: '10px',
          height: '10px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'normal',
          maxWidth: '100%',
        },
      },

      '& ol.custom-numeric': {
        counterReset: 'myCounter',
        '& > li': {
          listStyle: 'none',
          // marginBottom: '10px',
        },
        '& > li:before': {
          counterIncrement: 'myCounter',
          content: 'counter(myCounter) .',
          color: '#3882C4',
          // background: '#2980B9',
          display: 'inline-block',
          textAlign: 'center',
          // margin: '5px 10px',
          lineHeight: '25px',
          // width: '25px',
          minWidth: '25px',
          marginRight: '10px',
          height: '25px',
        },
      },
      '& ul.dotted': {
        maxWidth: '100%',
        paddingLeft: 0,
        marginTop: 0,
        listStyle: 'none',
        '& > li::before': {
          color: 'inherit',
          display: 'inline-block',
          textAlign: 'center',
          margin: '0 15px 0 0',
          lineHeight: '40px',
          width: '10px',
          height: '10px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'normal',
          maxWidth: '100%',
        },
        '& > li': {
          display: 'flex',
          alignItems: 'start',
        },
        '& > li > .dot': {
          color: 'white',
          background: '#fff',
          display: 'inline-block',
          textAlign: 'center',
          marginRight: '20px',
          lineHeight: '30px',
          // width: '20px',
          minWidth: '20px',
          height: '20px',
          backgroundImage: 'url(/static/svg/yellow-dot.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          // backgroundSize: 'contain',
        },
        '& > li > .empty': {
          minWidth: '20px',
          height: '20px',
          display: 'inline-block',
          textAlign: 'center',
          marginRight: '20px',
          lineHeight: '30px',
        },
        '& > li > .attention': {
          color: 'white',
          background: '#fff',
          display: 'inline-block',
          textAlign: 'center',
          marginRight: '10px',
          lineHeight: '30px',
          // width: '20px',
          minWidth: '30px',
          height: '30px',
          backgroundImage: 'url(/static/svg/yellow-attention.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        },
      },
      */
    },

    // Actions box:
    actionsBoxRight: {
      // marginTop: '15px',

      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      '& > *': {
        marginBottom: theme.spacing(1),
      },
      '& > *:not(:first-child)': {
        marginLeft: theme.spacing(1),
      },
      alignItems: 'center',
    },
    actionsBoxLeft: {
      // marginTop: '15px',

      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      '& > *': {
        marginBottom: theme.spacing(1),
      },
      '& > *:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
      alignItems: 'center',
    },

    cardsWrapper: {
      border: '1px solid red',
    },

    standardCard: {
      // backgroundColor: '#FFF',
      border: '2px solid #fff',
      borderRadius: '8px',
      boxShadow: 'unset',
      // transition: 'box-shadow 0.3s linear',
      '&:hover': {
        boxShadow: '0px 0px 8px rgba(144, 164, 183, 0.6)',
      },
      '& > div': {
        padding: theme.spacing(1),
      },
      '& h4': {
        [theme.breakpoints.up('md')]: {
          fontSize: '16px !important',
        },
      },
    },
    cursorPointer: {
      cursor: 'pointer',
    },
    standardCardHeader: {
      padding: theme.spacing(1, 0, 1, 0),
    },
    standardCardFooter: {
      // borderTop: '1px solid #FFF',
      padding: theme.spacing(2, 0, 0, 0),
    },
  })
)

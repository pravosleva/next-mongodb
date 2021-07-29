import Head from 'next/head'
import { Navbar } from './components/Navbar'
import NextNProgress from 'nextjs-progressbar'
// <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
import { theme, md } from '~/common/styled-mui/theme'
import { Container } from '@material-ui/core'
import {
  // ScrollTopButton,
  SpeedDial,
} from './components'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { Footer } from './components/Footer'
import { useStyles } from './styles'
import { useBaseStyles } from '~/common/styled-mui/baseStyles'
import { SidebarContent } from '~/common/components/SidebarContent'
import { useWindowSize } from '~/common/hooks'

export const Layout = ({ children }) => {
  const router = useRouter()
  const isTheNotePage = router.pathname === '/notes/[id]' || router.pathname === '/local-notes/[id]'
  const classes = useStyles()
  const baseClasses = useBaseStyles()
  const { isDesktop, isMobile } = useWindowSize()

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.0/css/all.css"
          integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y"
          crossOrigin="anonymous"
        />
      </Head>
      <NextNProgress
        // color={theme.palette.primary.main}
        color="rgb(252, 191, 44)"
        startPosition={0.3}
        stopDelayMs={200}
        height={2}
        options={{ showSpinner: true }}
      />
      <Navbar />
      <div className={classes.minimalHeightSetting}>
        <Container
          style={
            {
              // border: '1px solid red',
              // display: 'flex',
              // border: 'none',
            }
          }
          maxWidth="md"
          className={clsx({
            [baseClasses.noPaddingMobile]: isTheNotePage,
          })}
        >
          <div className={classes.contentBox}>
            <div>{children}</div>
            {isDesktop && (
              <div className={classes.sidebarInLayoutWrapper}>
                <SidebarContent />
              </div>
            )}
          </div>
        </Container>
      </div>
      {isMobile && <Footer />}
      {isMobile && router.pathname !== '/new' && <SpeedDial />}
      <style jsx global>{`
        #nprogress .spinner {
          display: block;
          position: fixed;
          z-index: 1031;
          right: 8px;
        }
        @media (min-width: ${md + 1}px) {
          #nprogress .spinner {
            top: 22px;
          }
        }
        @media (max-width: ${md}px) {
          #nprogress .spinner {
            top: 19px;
          }
        }
      `}</style>
    </>
  )
}

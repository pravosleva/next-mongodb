import NextApp from 'next/app'
import 'semantic-ui-css/semantic.min.css'
import { Layout } from '~/common/components/Layout'
import 'react-markdown-editor-lite/lib/index.css'
import '~/public/static/css/style.css'
import {
  AuthContextProvider,
  GlobalAppContextProvider,
  NotifsContextProvider,
  SocketContextProvider,
} from '~/common/context'
import { CookiesProvider } from 'react-cookie'
import Head from 'next/head'
import 'react-notifications-component/dist/theme.css'
// preferred way to import (from `v4`). Uses `animate__` prefix.
import 'animate.css/animate.min.css'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { theme } from '~/common/styled-mui/theme'
// import { ExternalChatWidget } from '~/common/components/ExternalChatWidget'
// import { ExternalPrivateFrameWidget } from '~/common/components/ExternalPrivateFrameWidget'
import { SidebarContent } from '~/common/components/SidebarContent'
import { Widget, EWidgetNames, WidgetContextProvider } from '~/common/components/Widget'
import '~/wdyr'

class MyApp extends NextApp {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/static/favicon.ico" />
          <title>Code Samples 2.0</title>
          {/* PWA primary color */}
          {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
          <meta name="theme-color" content="#000" />
          <meta name="viewport" content="width=device-width" />
          {/* <meta name="viewport" content="initial-scale=1, maximum-scale=1" /> */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <NotifsContextProvider>
            <CookiesProvider>
              <AuthContextProvider>
                {/* <ExternalChatWidget src="http://selection4test.ru:5000" />
                <ExternalPrivateFrameWidget src="https://selection4test.ru/projects/threejs-ts-course" /> */}
                <GlobalAppContextProvider>
                  <SocketContextProvider>
                    <WidgetContextProvider>
                      <Layout>
                        <Component {...pageProps} />
                        <Widget isMobileOnly widgetName={EWidgetNames.AnyNotes}>
                          <SidebarContent />
                        </Widget>
                      </Layout>
                    </WidgetContextProvider>
                  </SocketContextProvider>
                </GlobalAppContextProvider>
              </AuthContextProvider>
            </CookiesProvider>
          </NotifsContextProvider>
        </ThemeProvider>
      </>
    )
  }
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp

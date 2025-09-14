/* eslint-disable no-use-before-define */
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
// import { theme } from '~/styled-mui/common/theme'
// {theme.palette.primary.main}

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/static/pwa/favicon.ico" sizes="48x48" />
          <link rel="icon" href="/static/pwa/file-code-01.svg" sizes="any" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/static/pwa/apple-touch-icon-180x180.png"></link>
          <link rel="manifest" href="./static/manifest.json" crossorigin="use-credentials" />
          <link rel="shortcut icon" href="/static/pwa/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <link rel="stylesheet" href="/static/css/old.styles.css" />
          <link rel="stylesheet" href="/static/css/old.build.editor-js.css" />
          <link rel="stylesheet" href="/static/css/fix.react-notifications-component.css" />
          <link rel="stylesheet" href="/static/css/fix.react-markdown-editor-lite.css" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400italic" />

          <meta name="application-name" content="Code Samples 2.0" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Code Samples" />
          <meta name="description" content="Смотри что я нашел!" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          {/* <meta name='msapplication-config' content='/static/icons/browserconfig.xml' /> */}
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* <script
            id="vite-plugin-pwa:register-sw"
            dangerouslySetInnerHTML={{
              __html: `
              if('serviceWorker' in navigator){
                // window.addEventListener('load', () => {
                //   navigator.serviceWorker.register('./sw.js', { scope: './' })
                // })
                if(!self.define){
                  let e,s={};
                  const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{
                    if("document"in self){
                      const e=document.createElement("script");
                      e.src=i,e.onload=s,document.head.appendChild(e)
                    } else e=i,importScripts(i),s()})
                  )
                    .then((()=>{let e=s[i];if(!e)throw new Error(\`Module \${i} didn’t register its module\`);
                      return e})));
                  self.define=(r,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let l={};const o=e=>i(e,t),u={module:{uri:t},exports:l,require:o};s[t]=Promise.all(r.map((e=>u[e]||o(e)))).then((e=>(n(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/chunk.0.react-dom-DcfgeyRI.js",revision:null},{url:"assets/chunk.1.@mui_material-CKGrLUDc.js",revision:null},{url:"assets/chunk.2.dayjs-BPUg6-v7.js",revision:null},{url:"assets/chunk.3.react-google-charts-zCIuIbqL.js",revision:null},{url:"assets/chunk.4.react-hook-form-BWQihaOz.js",revision:null},{url:"assets/index-DmWz6co7.css",revision:null},{url:"assets/index-W7qP1xfX.js",revision:null},{url:"index.html",revision:"680d72cd3e997a1cbf2b904cb76d6535"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"stats.html",revision:"4d87088189f27a31eecdaa4282ea7afa"},{url:"site.webmanifest",revision:"d1c72fd2420cfc608d73e0c2a307ec06"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
              }`,
            }}
          ></script> */}
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  }
}

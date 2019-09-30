/* eslint-disable react/jsx-filename-extension, react/no-danger, react/jsx-props-no-spreading  */

import * as React from 'react'

function HTML(props) {
  const {
    htmlAttributes,
    headComponents,
    bodyAttributes,
    preBodyComponents,
    body,
    postBodyComponents
  } = props

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
        {postBodyComponents}
        <script
          src="https://browser.sentry-cdn.com/4.6.1/bundle.min.js"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `Sentry.init({dsn: "https://fd05314f8eca444d9196e640db1f8ec9@sentry.io/1766178"});`
          }}
        />
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: ` (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-7672048829297382",
          enable_page_level_ads: true
     })`
          }}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `WebFontConfig = {
            google: { families: [ 'Raleway:300' ] }
          };
          (function() {
            var wf = document.createElement('script');
            wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
          })();`
          }}
        />
      </body>
    </html>
  )
}

export default HTML

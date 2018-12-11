/* eslint-disable react/jsx-filename-extension, react/no-danger  */

import * as React from 'react'

const sentry = (
  <script
    src="https://browser.sentry-cdn.com/4.4.1/bundle.min.js"
    crossOrigin="anonymous"
  />
)
const sentryInit = (
  <script
    dangerouslySetInnerHTML={{
      __html:
        "Sentry.init({ dsn: 'https://8eae9430aa0b478e8395d2f443f636fb@sentry.io/1341809' });"
    }}
  />
)
const jquery = <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" defer />
const popper = <script src="https://unpkg.com/popper.js/dist/umd/popper.min.js" defer />
const bootstrap = (
  <script
    src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
    defer
  />
)

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
        {sentry}
        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {sentryInit}
        {preBodyComponents}
        <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
        {postBodyComponents}
        {jquery}
        {popper}
        {bootstrap}
      </body>
    </html>
  )
}

export default HTML

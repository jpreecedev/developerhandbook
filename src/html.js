/* eslint-disable react/jsx-filename-extension, react/no-danger  */

import * as React from 'react'

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
        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {preBodyComponents}
        <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
        {postBodyComponents}
        {jquery}
        {popper}
        {bootstrap}
        <script
          type="text/javascript"
          src="//downloads.mailchimp.com/js/signup-forms/popup/unique-methods/embed.js"
          data-dojo-config="usePlainJson: true, isDebug: false"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `window.dojoRequire(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us7.list-manage.com","uuid":"59dc75620baddb24611cddb4a","lid":"cb867e2fbf","uniqueMethods":true}) })`
          }}
        />
      </body>
    </html>
  )
}

export default HTML

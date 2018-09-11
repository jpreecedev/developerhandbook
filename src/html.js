/* eslint-disable react/jsx-filename-extension,no-console,global-require,react/no-danger */

import * as React from 'react'

let stylesStr
if (process.env.NODE_ENV === `production`) {
  try {
    stylesStr = require(`!raw-loader!../public/styles.css`)
  } catch (e) {
    console.log(e)
  }
}

const jquery = <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" />
const popper = <script src="https://unpkg.com/popper.js/dist/umd/popper.min.js" />
const bootstrap = (
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" />
)

function HTML({
  headComponents,
  htmlAttributes,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents
}) {
  let css
  if (process.env.NODE_ENV === `production`) {
    css = (
      <style id="gatsby-inlined-css" dangerouslySetInnerHTML={{ __html: stylesStr }} />
    )
  }
  return (
    <html lang="en-GB" prefix="og: http://ogp.me/ns#" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {headComponents}
        {css}
      </head>
      <body {...bodyAttributes}>
        {jquery}
        {popper}
        {bootstrap}
        {preBodyComponents}
        <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
        {postBodyComponents}
      </body>
    </html>
  )
}

module.exports = HTML

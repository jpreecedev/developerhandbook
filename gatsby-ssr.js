/* eslint-disable import/prefer-default-export, react/no-danger  */
import React from 'react'

const ampBoilerplate = `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents, pathname }) => {
  setHtmlAttributes({ amp: '' })
  setHeadComponents([
    <script async src="https://cdn.ampproject.org/v0.js" />,
    <link rel="canonical" href={pathname} />,
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />,
    <style amp-boilerplate="" dangerouslySetInnerHTML={{ __html: ampBoilerplate }} />
  ])
}

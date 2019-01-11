import React from 'react'

const ampBoilerplate = `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
const ampNoscriptBoilerplate = `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`

const interpolate = (str, map) =>
  str.replace(/{{\s*[\w\.]+\s*}}/g, match => map[match.replace(/[{}]/g, '')])

export const onPreRenderHTML = ({
  getHeadComponents,
  getPostBodyComponents,
  replaceHeadComponents,
  replacePostBodyComponents,
  pathname
}) => {
  const headComponents = getHeadComponents()
  const postBodyComponents = getPostBodyComponents()

  const pathIdentifier = 'amp/'
  const isAmp = pathname && pathname.indexOf(pathIdentifier) > -1
  if (!isAmp) {
    return
  }

  const styles = headComponents.reduce((str, x) => {
    if (x.type === 'style') {
      str += x.props.dangerouslySetInnerHTML.__html
    }
    return str
  }, '')

  replaceHeadComponents([
    <style amp-custom="" dangerouslySetInnerHTML={{ __html: styles }} />,
    <script async src="https://cdn.ampproject.org/v0.js" />,
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />,
    <style amp-boilerplate="" dangerouslySetInnerHTML={{ __html: ampBoilerplate }} />,
    <noscript>
      <style
        amp-boilerplate=""
        dangerouslySetInnerHTML={{ __html: ampNoscriptBoilerplate }}
      />
    </noscript>,
    <link
      rel="canonical"
      href={interpolate('{{canonicalBaseUrl}}{{pathname}}', {
        canonicalBaseUrl: 'https://developerhandbook.com',
        pathname
      })
        .replace(pathIdentifier, '')
        .replace(/([^:])(\/\/+)/g, '$1/')}
    />,
    ...headComponents.filter(x => x.type !== 'style' && x.type !== 'script')
  ])

  replacePostBodyComponents(postBodyComponents.filter(x => x.type !== 'script'))
}

export const onRenderBody = ({ setHtmlAttributes, pathname }) => {
  const pathIdentifier = 'amp/'
  const isAmp = pathname && pathname.indexOf(pathIdentifier) > -1
  if (!isAmp) {
    return
  }
  setHtmlAttributes({ amp: '' })
}

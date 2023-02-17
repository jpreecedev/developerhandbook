import config from '../../../site-config'

function SocialProfile() {
  const { url, social } = config
  const { name, twitter, youtube, facebook } = social

  const scriptData = {
    '@context': 'http://schema.org',
    '@type': 'Person',
    name,
    url,
    sameAs: [twitter, youtube, facebook]
  }

  return JSON.stringify(scriptData)
}

export default SocialProfile

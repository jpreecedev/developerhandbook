const siteConfig = require('./site-config')

module.exports = {
  pathPrefix: `/developerhandbook`,
  siteMetadata: {
    siteTitle: 'DeveloperHandbook.com - Cleaner code, better code.',
    title: 'DeveloperHandbook.com - Cleaner code, better code.',
    author: 'Jon Preece',
    description: siteConfig.description,
    siteUrl: siteConfig.url
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1110
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants'
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-42743116-1`
      }
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: siteConfig.url
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        title: 'DeveloperHandbook.com - Cleaner code, better code.',
        query: `
        {
          site {
            siteMetadata {
              title: siteTitle
              description
              siteUrl
            }
          }
        }
      `
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-sitemap`
    },
    'gatsby-plugin-no-sourcemaps',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `DeveloperHandbook.com`,
        short_name: 'DeveloperHandbook.com',
        homepage_url: `https://developerhandbook.com`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#ff8300`,
        display: `minimal-ui`,
        icon: `src/images/code.png` // This path is relative to the root of the site.
      }
    },
    `gatsby-plugin-offline`
  ]
}

const siteConfig = require('./site-config')

const siteTitle = 'DeveloperHandbook.com - Cleaner code, better code.'
const googleTrackingId = `UA-42743116-1`
const baseUrl = siteConfig.url

module.exports = {
  siteMetadata: {
    siteTitle,
    title: siteTitle,
    author: 'Jon Preece',
    description: siteConfig.description,
    siteUrl: siteConfig.url
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1110,
              linkImagesToOriginal: true,
              withWebp: true,
              showCaptions: true,
              wrapperStyle:
                'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;'
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: googleTrackingId
      }
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: siteConfig.url
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [
          { userAgent: '*', disallow: '/tags', allow: '*' },
          { userAgent: '*', disallow: '/wp-content', allow: '*' }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge => {
                const url = `${
                  site.siteMetadata.siteUrl
                }/${edge.node.frontmatter.categories[0].toLowerCase()}${
                  edge.node.fields.slug
                }`
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url,
                  guid: url,
                  custom_elements: [{ 'content:encoded': edge.node.html }]
                })
              }),
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                        categories
                        seriesTitle
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: siteTitle
          }
        ]
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
        short_name: 'devhbk',
        homepage_url: baseUrl,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#ff8300`,
        display: `minimal-ui`,
        icons: [
          {
            src: `icons/jonpreece-48.png`,
            sizes: `48x48`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-72.png`,
            sizes: `72x72`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-96.png`,
            sizes: `96x96`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-128.png`,
            sizes: `128x128`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-144.png`,
            sizes: `144x144`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-192.png`,
            sizes: `192x192`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-256.png`,
            sizes: `256x256`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-384.png`,
            sizes: `384x384`,
            type: `image/png`
          },
          {
            src: `icons/jonpreece-512.png`,
            sizes: `512x512`,
            type: `image/png`
          }
        ]
      }
    },
    `gatsby-plugin-polyfill-io`,
    `gatsby-plugin-offline`
  ]
}

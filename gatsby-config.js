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
              maxWidth: 1110,
              linkImagesToOriginal: true,
              withWebp: true
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
        short_name: 'DeveloperHandbook.com',
        homepage_url: baseUrl,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#ff8300`,
        display: `minimal-ui`,
        icon: `src/images/code.png` // This path is relative to the root of the site.
      }
    },
    'gatsby-plugin-remove-serviceworker'
  ]
}

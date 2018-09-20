import * as React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Nav from './Nav'
import { getDistinctCategories } from '../utils/categories'

import 'prismjs/themes/prism-coy.css'
import '../styles.scss'

function Template({ children }) {
  return (
    <StaticQuery
      query={graphql`
        {
          allMarkdownRemark {
            edges {
              node {
                frontmatter {
                  categories
                }
              }
            }
          }
        }
      `}
      render={data => (
        <>
          <a className="sr-only sr-only-focusable" href="#content">
            Skip to main content
          </a>
          <Nav categories={getDistinctCategories(data.allMarkdownRemark.edges)} />
          {children}
        </>
      )}
    />
  )
}

export default Template

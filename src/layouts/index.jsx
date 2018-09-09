import * as React from 'react'
import Nav from '../components/Nav'
import { getDistinctCategories } from '../utils/categories'

import 'prismjs/themes/prism-coy.css'
import '../styles.scss'

function Template({ children, data }) {
  const categories = getDistinctCategories(data.allMarkdownRemark.edges)
  return (
    <div>
      <Nav categories={categories} />
      {children()}
    </div>
  )
}

export const query = graphql`
  query LayoutQuery {
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
`

export default Template

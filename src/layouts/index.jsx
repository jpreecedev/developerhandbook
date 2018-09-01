import * as React from 'react'
import Nav from '../components/Nav'

import 'prismjs/themes/prism-coy.css'
import '../styles.scss'

function Template({ children, data }) {
  const categories = data.allMarkdownRemark.edges.reduce((acc, current) => {
    const data = current.node.frontmatter.categories
    if (data) {
      data.forEach(item => {
        if (item && !acc.includes(item)) {
          acc.push(item)
        }
      })
    }
    return acc
  }, [])

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

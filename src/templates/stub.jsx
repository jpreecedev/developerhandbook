/* eslint-disable react/no-danger */

import * as React from 'react'
import Helmet from 'react-helmet'
import { getCategoryUrlFriendly } from '../utils/categories'
import Pagination from '../components/Pagination'
import Layout from '../components/Layout'
import PostOverview from '../components/PostOverview'
import SocialProfile from '../components/StructuredData/SocialProfile'

function StubTemplate(props) {
  const { location, pageContext } = props
  const { posts, siteTitle, description } = pageContext

  if (!posts) {
    return null
  }

  return (
    <Layout>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <script type="application/ld+json">{SocialProfile()}</script>
      </Helmet>
      <main id="content" role="main" className="mb-5 mt-4">
        <div className="container">
          <div className="row mb-2">
            {posts.map(post => (
              <div className="col-12 col-md-6 col-lg-4" key={post.fields.slug}>
                <PostOverview
                  post={post}
                  key={post.fields.slug}
                  title={post.frontmatter.title}
                  slug={post.fields.slug}
                  mappedCategory={`${getCategoryUrlFriendly(
                    post.frontmatter.categories[0]
                  )}`}
                  excerpt={post.excerpt}
                />
              </div>
            ))}
          </div>
        </div>
        <Pagination location={location} />
      </main>
    </Layout>
  )
}

export default StubTemplate

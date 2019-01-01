/* eslint-disable react/no-danger */

import * as React from 'react'
import Helmet from 'react-helmet'
import Jumbotron from '../components/Jumbotron'
import { getCategoryUrlFriendly } from '../utils/categories'
import Pagination from '../components/Pagination'
import Layout from '../components/Layout'
import PostOverview from '../components/PostOverview'
import SocialProfile from '../components/StructuredData/SocialProfile'

function StubTemplate(props) {
  const { location, pageContext } = props
  const { posts, siteTitle, description, category } = pageContext

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
      <Jumbotron title={category} />
      <main id="content" role="main" className="container mb-5">
        <div className="row mb-2">
          {posts.map(post => (
            <div className="col-md-6" key={post.fields.slug}>
              <div className="card flex-md-row mb-4 shadow-sm h-md-250">
                <div className="card-body d-flex flex-column align-items-start">
                  <PostOverview
                    post={post}
                    key={post.fields.slug}
                    title={post.frontmatter.title}
                    slug={post.fields.slug}
                    mappedCategory={`${getCategoryUrlFriendly(category)}`}
                    excerpt={post.excerpt}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination location={location} />
      </main>
    </Layout>
  )
}

export default StubTemplate

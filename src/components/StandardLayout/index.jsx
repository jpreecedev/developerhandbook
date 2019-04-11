import React from 'react'

function StandardLayout({ children, title }) {
  return (
    <main
      id="content"
      role="main"
      className="container"
      style={{ marginBottom: '10rem' }}
    >
      <div className="row">
        <article className="col-12">
          <h1 className="mt-0 mb-3">{title}</h1>
          {children}
        </article>
      </div>
    </main>
  )
}

export default StandardLayout

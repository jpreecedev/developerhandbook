import React from 'react'

function StandardLayout({ children }) {
  return (
    <main
      id="content"
      role="main"
      className="container"
      style={{ marginBottom: '10rem' }}
    >
      <div className="row">
        <article className="col-12">{children}</article>
      </div>
    </main>
  )
}

export default StandardLayout

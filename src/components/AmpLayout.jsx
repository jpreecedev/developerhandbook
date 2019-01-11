import * as React from 'react'

function Template({ children }) {
  return (
    <main id="content" role="main" style={{ padding: '20px' }}>
      {children}
    </main>
  )
}

export default Template

import * as React from 'react'

function Jumbotron({ title }) {
  return (
    <div className="jumbotron jumbotron-fluid">
      <div className="container">
        <h1 className="text-center">{title}</h1>
      </div>
    </div>
  )
}

export default Jumbotron

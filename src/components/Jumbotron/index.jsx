import * as React from 'react'
import code from '../../images/code.png'

import styles from './styles.module.scss'

function Jumbotron({ title }) {
  return (
    <div
      className={`${styles.jumbotron} jumbotron jumbotron-fluid `}
      style={{ backgroundImage: `url(${code})` }}
    >
      <div className="container">
        <div className="">
          <h1 className={`${styles.title} text-center`}>{title}</h1>
        </div>
      </div>
    </div>
  )
}

export default Jumbotron

import * as React from 'react'
import code from '../../images/code.png'

import styles from './styles.module.scss'

function Jumbotron({ title }) {
  return (
    <div className={`${styles.jumbotron} jumbotron jumbotron-fluid`}>
      <div className="container">
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${code})`
          }}
        />
        <h1 className={`${styles.title} text-center`}>{title}</h1>
      </div>
    </div>
  )
}

export default Jumbotron

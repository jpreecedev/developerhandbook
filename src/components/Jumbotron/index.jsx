import * as React from 'react'
import code from '../../images/code.png'

import styles from './styles.module.scss'

function Jumbotron() {
  return (
    <div
      className={`jumbotron jumbotron-fluid ${styles.jumbotron}`}
      style={{
        backgroundImage: `url(${code})`
      }}
    />
  )
}

export default Jumbotron

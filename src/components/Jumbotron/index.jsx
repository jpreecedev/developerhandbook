import * as React from 'react'
import code from '../../images/code.png'
import codeWebp from '../../images/code.webp'

import styles from './styles.module.scss'

function Jumbotron() {
  return (
    <div className={`jumbotron jumbotron-fluid ${styles.jumbotron}`}>
      <div className={styles.hero}>
        <picture>
          <source srcSet={codeWebp} type="image/webp" />
          <source srcSet={code} type="image/jpeg" />
          <img src={code} alt="DeveloperHandbook.com" />
        </picture>
      </div>
    </div>
  )
}

export default Jumbotron

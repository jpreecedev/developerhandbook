import * as React from 'react'
import Link from 'gatsby-link'
import logo from '../images/developerhandbook.png'
import { CATEGORIES_MAP } from '../utils/categories'

function Nav({ categories }) {
  return (
    <nav className="navbar navbar-expand-md navbar-light nav-shadow fixed-top bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="DeveloperHandbook.com" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mainNavBar"
          aria-controls="mainNavBar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-md-end" id="mainNavBar">
          <ul className="navbar-nav">
            {categories.map(category => (
              <li className="nav-item" key={category}>
                <Link
                  className="nav-link"
                  to={`/${
                    category in CATEGORIES_MAP
                      ? CATEGORIES_MAP[category]
                      : category.toLowerCase().replace(' ', '-')
                  }`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav

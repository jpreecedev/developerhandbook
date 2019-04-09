import * as React from 'react'
import { Link } from 'gatsby'
import logo from '../images/developerhandbook.png'
import { DEFAULT_GROUPS, getLink } from '../utils/categories'

function Nav() {
  return (
    <nav className="navbar navbar-expand-md navbar-light nav-shadow fixed-top bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="DeveloperHandbook.com" />
        </Link>

        <div className="collapse navbar-collapse justify-content-md-end" id="mainNavBar">
          <ul className="navbar-nav">
            {Object.keys(DEFAULT_GROUPS).map(navCategory => (
              <li className="nav-item pointer" key={navCategory}>
                <Link className="nav-link" to={getLink(navCategory)}>
                  {navCategory}
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

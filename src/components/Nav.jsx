import * as React from 'react'
import Link from 'gatsby-link'
import logo from '../images/developerhandbook.png'

function Nav() {
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
          data-target="#navbarsExampleDefault"
          aria-controls="navbarsExampleDefault"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" href="/">
                Home
                {' '}
                <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav

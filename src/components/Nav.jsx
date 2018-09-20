import * as React from 'react'
import { Link } from 'gatsby'
import logo from '../images/developerhandbook.png'
import { DEFAULT_CATEGORIES, getLink } from '../utils/categories'

function getMainNavItems(categories) {
  return DEFAULT_CATEGORIES.map(defaultCategory =>
    categories.filter(category => category === defaultCategory)
  )
}

function getOtherNavItems(categories) {
  return categories.filter(category => !DEFAULT_CATEGORIES.includes(category))
}

function Nav({ categories }) {
  let toggleButton

  function setToggleRef(button) {
    toggleButton = button
  }

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
          ref={setToggleRef}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-md-end" id="mainNavBar">
          <ul className="navbar-nav">
            {getMainNavItems(categories).map(navCategory =>
              navCategory.map(category => (
                <li className="nav-item" key={category}>
                  <Link
                    onClick={() => toggleButton.click()}
                    className="nav-link"
                    to={getLink(category)}
                  >
                    {category}
                  </Link>
                </li>
              ))
            )}

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                id="dropdown07"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                More
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdown07">
                {getOtherNavItems(categories).map(navCategory => (
                  <Link
                    onClick={() => toggleButton.click()}
                    className="dropdown-item"
                    key={navCategory}
                    to={getLink(navCategory)}
                  >
                    {navCategory}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav

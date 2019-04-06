import * as React from 'react'
import { Link } from 'gatsby'

function getCurrentPage({ pathname }) {
  if (pathname === '/') {
    return 1
  }

  return Number.parseInt(window.location.pathname.match(/\d+/g)[0], 10)
}

function getPages(currentPage) {
  const result = []
  if (currentPage === 1) {
    result.push(1)
    result.push(2)
    result.push(3)
  } else if (currentPage > 1) {
    result.push(currentPage - 1)
    result.push(currentPage)
    result.push(currentPage + 1)
  }
  return result
}

function Pagination({ location, pageCount }) {
  const currentPage = getCurrentPage(location)
  const pages = getPages(currentPage)
  if (!pages.length) {
    return null
  }

  return (
    <nav aria-label="Navigation" className="mt-5 mb-5">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <Link
            className="page-link"
            to={currentPage - 1 < 2 ? '/' : `/page/${currentPage - 1}`}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </Link>
        </li>
        {pages.map(page => (
          <li
            key={`/page/${page}`}
            className={`page-item ${page === currentPage ? 'active' : ''}`}
          >
            <Link className="page-link" to={page === 1 ? '/' : `/page/${page}`}>
              {page}
            </Link>
          </li>
        ))}

        <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
          <Link className="page-link" to={`/page/${currentPage + 1}`} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination

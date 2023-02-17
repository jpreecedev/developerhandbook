import * as React from 'react'
import jonpreece from '../images/jonpreece-96.png'

function MiniProfile() {
  return (
    <div className="d-md-flex mb-5 bg-light rounded border border-success p-md-3">
      <img
        src={jonpreece}
        className="align-self-center rounded-circle mr-auto ml-auto d-block mt-3 mb-3"
        alt="Jon Preece"
      />

      <div className="align-self-center pl-3 pr-3 text-center text-md-left">
        <h3 className="mt-0">About the author</h3>
        <p>
          <a href="https://jpreecedev.com" rel="noreferrer noopener" target="_blank">
            Jon Preece
          </a>{' '}
          is a professional front-end development specialist.
        </p>
        <p>
          For over a decade, Jon has worked for some of the biggest and best UK based
          companies, on a wide range of products.{' '}
          <a
            href="https://twitter.com/jpreecedev"
            rel="noreferrer noopener"
            target="_blank"
          >
            Get in touch via Twitter
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default MiniProfile

import * as React from 'react'
import jonpreece from '../images/jonpreece-square.jpg'

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
          I am
          {' '}
          <a href="https://jpreecedev.com" rel="noreferrer noopener" target="_blank">
            Jon Preece
          </a>
          , an experienced website and software developer from the United Kingdom, based
          in Manchester.
        </p>
        <p>
          Throughout my 10+ year professional career I have worked in many sectors,
          including; e-commerce, financial services, marketing, healthcare, travel and
          accountancy.
          {' '}
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

import * as React from 'react'
import jonpreece from '../images/jonpreece-square.png'

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
          <a
            href="https://twitter.com/jpreecedev"
            rel="noreferrer noopener"
            target="_blank"
          >
            Jon Preece
          </a>
          , an experienced full stack website and software developer from Warrington (UK)
          currently working in and around Manchester (UK).
        </p>
        <p className="d-none d-md-block">
          Throughout my 10+ year professional career I have worked in many sectors,
          including; e-commerce, financial services, marketing, healthcare, travel and
          accountancy.
        </p>
        <p className="d-none d-md-block">
          I love to teach, I love to learn and share my knowledge with others, I love to
          speak at public events.
        </p>
      </div>
    </div>
  )
}

export default MiniProfile

import * as React from 'react'
import jonpreece from '../images/jonpreece-square.png'

function MiniProfile() {
  return (
    <div className="row mb-5 bg-light rounded border border-success p-md-3">
      <div className="col">
        <div className="d-md-flex">
          <img
            src={jonpreece}
            className="align-self-center rounded-circle mr-auto ml-auto d-block mt-3 mb-3"
            alt="Jon Preece"
          />

          <div className="align-self-center pl-3">
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
              , an experienced full stack website and software developer from Warrington
              (UK) currently working in and around Manchester (UK).
            </p>
            <p>
              Throughout my 10+ year professional career I have done it all. E-commerce,
              financial services, marketing, healthcare, travel and accountancy. My drive
              and determination to deliver the best has meant that I have risen to every
              challenge. I do not struggle under pressure, I excel under pressure.
            </p>
            <p>
              I love to teach, I love to train and share my knowledge with others, I love
              to speak at public events.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiniProfile
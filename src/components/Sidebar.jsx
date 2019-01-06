import * as React from 'react'

function Sidebar() {
  return (
    <>
      <h5 className="text-center mt-0 mb-3">My favourite books</h5>
      <ul className="list-group mb-3">
        <li className="list-group-item text-center justify-content-around">
          <div>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.amazon.co.uk/gp/product/B01LFAN88E/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=B01LFAN88E&linkCode=as2&tag=jprecom-21&linkId=3370a768afea8a6c31927ad0e193b636"
            >
              <img
                alt=""
                border="0"
                style={{ maxWidth: '150px', width: '100%' }}
                src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=GB&ASIN=B01LFAN88E&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=jprecom-21"
              />
              <small className="d-block mb-0 mt-2 text-center">
                React Design Patterns and Best Practices*
              </small>
            </a>
            <img
              src="//ir-uk.amazon-adsystem.com/e/ir?t=jprecom-21&l=am2&o=2&a=B01LFAN88E"
              width="1"
              height="1"
              border="0"
              alt=""
              style={{ border: 'none !important', margin: '0 !important' }}
            />
          </div>
        </li>
        <li className="list-group-item text-center justify-content-between">
          <div>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.amazon.co.uk/gp/product/1617292397/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=1617292397&linkCode=as2&tag=jprecom-21&linkId=621ef252f1f8c93c43e8659b34976319"
            >
              <img
                alt=""
                border="0"
                style={{ maxWidth: '150px', width: '100%' }}
                src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=GB&ASIN=1617292397&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=jprecom-21"
              />
              <small className="d-block mb-0 mt-2 text-center">
                Soft Skills: The software developer's life manual*
              </small>
            </a>
            <img
              src="//ir-uk.amazon-adsystem.com/e/ir?t=jprecom-21&l=am2&o=2&a=1617292397"
              width="1"
              height="1"
              border="0"
              alt=""
              style={{ border: 'none !important', margin: '0 !important' }}
            />
          </div>
        </li>
        <li className="list-group-item text-center justify-content-between">
          <div>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.amazon.co.uk/gp/product/0857207288/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0857207288&linkCode=as2&tag=jprecom-21&linkId=50e6b6cea3487faab1d531e4f44abf95"
            >
              <img
                alt=""
                border="0"
                style={{ maxWidth: '150px', width: '100%' }}
                src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=GB&ASIN=0857207288&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=jprecom-21"
              />

              <small className="d-block mb-0 mt-2 text-center">
                How To Win Friends and Influence People*
              </small>
            </a>
            <img
              src="//ir-uk.amazon-adsystem.com/e/ir?t=jprecom-21&l=am2&o=2&a=0857207288"
              width="1"
              height="1"
              border="0"
              alt=""
              style={{ border: 'none !important', margin: '0 !important' }}
            />
          </div>
        </li>
      </ul>
      <small className="text-muted text-right d-block" style={{ fontSize: '10px' }}>
        * Affiliate link, I may receive a small payment from your purchase, at no cost to
        yourself, to help fund the site. I thank you for your support.
      </small>
    </>
  )
}

export default Sidebar

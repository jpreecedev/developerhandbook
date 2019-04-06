import * as React from 'react'

import { toNumber } from './utils'

function Summary({
  bidPrice,
  bidPricePrevious,
  marketCap,
  preTaxProfit,
  netDebt,
  annualDividend
}) {
  return (
    <>
      <h5 className="card-title mt-0">Summary</h5>
      <p className="mb-1">
        {toNumber(bidPrice) > toNumber(bidPricePrevious)
          ? '✅ The share price has gone up'
          : '🚫 The share price has gone down'}
      </p>
      <p className="mb-1">
        {toNumber(marketCap) > toNumber(preTaxProfit) * 15
          ? '✅ The company valuation is less than 15x net profit'
          : '🚫 The company valuation is greater than 15x net profit'}
      </p>
      <p className="mb-1">
        {toNumber(annualDividend) / toNumber(bidPrice) >= 0.05
          ? '✅ The dividend yield is at least 5%'
          : '🚫 The dividend yield is less than 5%'}
      </p>
      <p className="mb-1">
        {toNumber(netDebt) < toNumber(preTaxProfit) * 3
          ? '✅ Company net debt is less than 3x net profit'
          : '🚫 Company net debt is greater than 3x net profit'}
      </p>
    </>
  )
}

export default Summary

import * as React from 'react'

import initialState from './initialState'
import Summary from './summary'
import Help from './help'
import { reducer } from './reducer'
import { formatNumber } from './utils'

function SharePriceEvaluator() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const {
    companyName,
    bidPrice,
    bidPricePrevious,
    marketCap,
    annualDividend,
    netDebt,
    preTaxProfit
  } = state

  return (
    <div
      className="card bg-light text-smaller"
      style={{
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <div className="card-body">
        <h5 className="card-title mt-0">Share price evaluator</h5>
        <form>
          <div className="form-row">
            <div className="form-group col-12">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                placeholder="Enter the name of the company"
                value={companyName}
                onChange={e =>
                  dispatch({
                    type: 'update',
                    field: 'companyName',
                    value: e.target.value
                  })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-12 col-sm-6">
              <label htmlFor="bidPrice">Bid (Sell) Price (GBX)</label>
              <input
                type="text"
                className="form-control"
                id="bidPrice"
                placeholder="Enter the bid (sell) price"
                value={bidPrice}
                onChange={e =>
                  dispatch({
                    type: 'update',
                    field: 'bidPrice',
                    value: formatNumber(e.target.value)
                  })}
              />
            </div>
            <div className="form-group col-12 col-sm-6">
              <label htmlFor="bidPricePrevious">Price 12 months ago (GBX)</label>
              <input
                type="text"
                className="form-control"
                id="bidPricePrevious"
                placeholder="Enter the bid price from 12 months ago"
                value={bidPricePrevious}
                onChange={e =>
                  dispatch({
                    type: 'update',
                    field: 'bidPricePrevious',
                    value: formatNumber(e.target.value)
                  })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-12 col-sm-6">
              <label htmlFor="marketCap">Current Market Cap (GBP)</label>
              <input
                type="text"
                className="form-control"
                id="marketCap"
                placeholder="Enter the current market capitalisation"
                value={marketCap}
                onChange={e =>
                  dispatch({
                    type: 'update',
                    field: 'marketCap',
                    value: formatNumber(e.target.value)
                  })}
              />
            </div>
            <div className="form-group col-12 col-sm-6">
              <label htmlFor="annualDividend">Annual Dividend (GBX)</label>
              <input
                type="text"
                className="form-control"
                id="annualDividend"
                placeholder="Enter the expected annual dividend in pence (GBX)"
                value={annualDividend}
                onChange={e =>
                  dispatch({
                    type: 'update',
                    field: 'annualDividend',
                    value: formatNumber(e.target.value)
                  })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-12 col-sm-6">
              <label htmlFor="netDebt">Net Debt (GBP)</label>
              <input
                type="text"
                className="form-control"
                id="netDebt"
                placeholder="Enter the estimated net debt (GBP)"
                value={netDebt}
                onChange={e =>
                  dispatch({
                    type: 'update',
                    field: 'netDebt',
                    value: formatNumber(e.target.value)
                  })}
              />
            </div>
            <div className="form-group col-12 col-sm-6">
              <label htmlFor="preTaxProfit">Year Pre-Tax Profit (GBP)</label>
              <input
                type="text"
                className="form-control"
                id="preTaxProfit"
                placeholder="Enter the full year pre-tax profit (GBP)"
                value={preTaxProfit}
                onChange={e =>
                  dispatch({
                    type: 'update',
                    field: 'preTaxProfit',
                    value: formatNumber(e.target.value)
                  })}
              />
            </div>
          </div>
          <Help />
          <Summary {...state} />
        </form>
      </div>
    </div>
  )
}

export default SharePriceEvaluator

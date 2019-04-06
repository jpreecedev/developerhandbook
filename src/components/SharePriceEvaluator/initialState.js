import { formatNumber } from './utils'

const initialState = {
  companyName: 'Admiral Group',
  bidPrice: formatNumber(2012),
  bidPricePrevious: formatNumber(1886),
  marketCap: formatNumber(5740000000),
  annualDividend: formatNumber(114),
  netDebt: formatNumber(3952500000),
  preTaxProfit: formatNumber(405000000)
}

export default initialState

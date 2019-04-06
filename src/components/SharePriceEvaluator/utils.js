export function toNumber(x) {
  return Number(x.replace(new RegExp(',', 'g'), ''))
}

export function formatNumber(x) {
  return toNumber(x.toString()).toLocaleString('en-gb')
}

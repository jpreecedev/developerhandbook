const CATEGORIES_MAP = {
  'C#': 'c-sharp',
  '.NET': 'dot-net',
  'VS Code': 'vs-code'
}

const DEFAULT_CATEGORIES = ['C#', 'Career', 'TypeScript', 'Angular', 'Unit Testing']

function getLink(category) {
  return `/${
    category in CATEGORIES_MAP
      ? CATEGORIES_MAP[category]
      : category.toLowerCase().replace(' ', '-')
  }`
}

module.exports = { CATEGORIES_MAP, DEFAULT_CATEGORIES, getLink }

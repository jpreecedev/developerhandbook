const CATEGORIES_MAP = {
  'C#': 'c-sharp',
  '.NET': 'dot-net',
  'VS Code': 'vs-code'
}

const DEFAULT_CATEGORIES = ['C#', 'Career', 'TypeScript', 'Angular', 'Unit Testing']

function getDistinctCategories(edges) {
  return edges.reduce((acc, current) => {
    const data = current.node.frontmatter.categories
    if (data) {
      data.forEach(item => {
        if (item && !acc.includes(item)) {
          acc.push(item)
        }
      })
    }
    return acc
  }, [])
}

function getLink(category) {
  return `/category/${getCategoryUrlFriendly(category)}`
}

function getCategoryUrlFriendly(category) {
  return category in CATEGORIES_MAP
    ? CATEGORIES_MAP[category]
    : category.toLowerCase().replace(' ', '-')
}

module.exports = {
  CATEGORIES_MAP,
  DEFAULT_CATEGORIES,
  getLink,
  getDistinctCategories,
  getCategoryUrlFriendly
}

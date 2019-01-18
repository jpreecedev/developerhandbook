const CATEGORIES_MAP = {
  'C#': 'c-sharp',
  '.NET': '.net',
  'VS Code': 'vs-code'
}

const DEFAULT_CATEGORIES = ['C#', 'Webpack', 'TypeScript', 'Angular', 'Unit Testing']

function getCategoryUrlFriendly(category) {
  return category in CATEGORIES_MAP
    ? CATEGORIES_MAP[category]
    : category.toLowerCase().replace(' ', '-')
}

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

module.exports = {
  CATEGORIES_MAP,
  DEFAULT_CATEGORIES,
  getLink,
  getDistinctCategories,
  getCategoryUrlFriendly
}

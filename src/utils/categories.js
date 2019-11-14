const CATEGORIES_MAP = {
  'C#': 'c-sharp',
  '.NET': '.net',
  'VS Code': 'vs-code'
}

const DEFAULT_GROUPS = {
  'Software Development': [
    'C#',
    '.NET',
    'React',
    'Parcel.js',
    'TypeScript',
    'Web API',
    'JavaScript',
    'Webpack',
    'MongoDB',
    'Node',
    'WCF',
    'Entity Framework',
    'WPF MVVM',
    'WPF',
    'Git',
    'VS Code',
    'Angular',
    'Azure',
    'AWS',
    'Visual Studio',
    'Front-end',
    'Architecture',
    'Unit Testing',
    'Other'
  ],
  'Personal Growth': ['Career']
}

function getCategoryUrlFriendly(category) {
  return category in CATEGORIES_MAP
    ? CATEGORIES_MAP[category]
    : category.toLowerCase().replace(' ', '-')
}

function getDefaultGroups() {
  return Object.keys(DEFAULT_GROUPS)
}

function getLink(category) {
  return `/category/${getCategoryUrlFriendly(category)}`
}

module.exports = {
  CATEGORIES_MAP,
  DEFAULT_GROUPS,
  getLink,
  getCategoryUrlFriendly,
  getDefaultGroups
}

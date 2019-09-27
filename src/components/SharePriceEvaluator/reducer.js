/* eslint-disable */

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return Object.assign({}, state, { [action.field]: action.value })
    default:
      throw new Error()
  }
}

export { reducer }

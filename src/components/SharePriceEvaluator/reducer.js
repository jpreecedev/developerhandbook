function reducer(state, action) {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.value
      }
    default:
      throw new Error()
  }
}

export default reducer

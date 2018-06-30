import { SET_SCHEMA_TITLE } from '../types'

const INITIAL_STATE = {
  title: 'Dashboard',
  data: [],
  model: {}
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SET_SCHEMA_TITLE:
      return { ...state, title: payload }
    default:
      return state
  }
}

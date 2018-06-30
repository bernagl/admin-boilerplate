import { SET_SCHEMA_TITLE } from '../types'

export const setSchemaTitle = title => {
  return { type: SET_SCHEMA_TITLE, payload: title }
}

import { combineReducers } from 'redux'
import schema from './schema'

export default combineReducers({ auth: () => ({ uid: 1 }), schema })

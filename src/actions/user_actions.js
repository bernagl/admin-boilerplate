import { db } from './firebase-config'

export const updateUser = ({ lastCreditos, sucursalName, ...data }) => {
  const log = `${lastCreditos} créditos a ${data.creditos} créditos en ${sucursalName}`
  return db
    .ref('log')
    .push({ status: 1, log, ...data })
    .then(lr => lr.key)
    .catch(e => 404)
}

import { db } from './firebase-config'

export const updateUserCreditos = ({ lastCreditos, sucursalName, ...data }) => {
  const log = `${lastCreditos} crédito(s) a ${
    data.creditos
  } crédito(s) en ${sucursalName}`
  return db
    .ref('log')
    .push({ status: 1, log, ...data })
    .then(lr => lr.key)
    .catch(e => 404)
}

export const updateUserIlimitado = ({
  nuevaFecha,
  lastFecha,
  sucursalName,
  ...data
}) => {
  const log = `${lastFecha} a ${nuevaFecha} en ${sucursalName}`
  return db
    .ref('log')
    .push({ status: 1, log, ...data })
    .then(lr => lr.key)
    .catch(e => 404)
}

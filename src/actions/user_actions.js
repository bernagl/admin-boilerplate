import { db } from './firebase-config'
import moment from 'moment'

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

/**
 * Cancela la clase de un usuario y le regresa los créditos si no tiene suscripción ilímitada
 * @param {sid} sucursalId
 * @param {costo} costoClase
 * @param {cid} claseId
 * @param {uid} userId
 */
export const cancelarClase = ({ sid, costo, cid, uid }) => {
  const userRef = db.ref('usuario').child(uid)
  const classRef = db.ref('horario').child(cid)
  return userRef.once('value').then(snapshot => {
    const { clases: uclases, creditos: ucreditos, ilimitado } = snapshot.val()
    let isIlimitado = false
    if (typeof ilimitado === 'undefined') isIlimitado = false
    else isIlimitado = moment(ilimitado.fin) > moment() ? true : false
    const creditos = {
      ...ucreditos,
      [sid]: isIlimitado ? ucreditos[sid] : ucreditos[sid] + costo
    }
    const clases = { ...uclases, [cid]: 2 }
    return classRef.once('value').then(sclase => {
      const { inscritos: ci, inscritos_numero: cin } = sclase.val()
      const inscritos_numero = cin > 0 ? cin - 1 : 0
      const inscritos = { ...ci, [uid]: false }
      return classRef.update({ inscritos, inscritos_numero }).then(r => {
        return userRef.update({ clases, creditos }).then(r => 202)
      })
    })
  })
}

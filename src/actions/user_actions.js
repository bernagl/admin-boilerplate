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

export const updateInscripcionLog = data => {
  const log = 'Se agregó suscripción'
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

/**
 *
 * @param {uid} userID
 * @param {clases} arrayOfClasses
 * @param {isIlimitado} boolean
 *
 */
export const confirmCheckout = ({ clases, isIlimitado, uid }) => {
  const usuarioRef = db.ref('usuario').child(uid)
  return usuarioRef.once('value').then(snapshot => {
    const usuario = snapshot.val()
    let ucreditos = usuario.creditos
    let { invitado, clases: uclases } = usuario

    if (typeof uclases === 'undefined') uclases = {}

    clases.forEach(clase => {
      const creditos = usuario.creditos[clase.gimnasio.id]
        ? usuario.creditos[clase.gimnasio.id]
        : 0
      if (creditos > 0 || isIlimitado) {
        return db
          .ref('horario')
          .child(clase.id)
          .once('value')
          .then(snap => {
            const c = snap.val()
            if (c.cupo <= c.inscritos_numero) return 404
            const inscritos = c.inscritos
              ? { ...c.inscritos, [uid]: true }
              : { [uid]: true }
            return db
              .ref('horario')
              .child(clase.id)
              .update({ inscritos, inscritos_numero: c.inscritos_numero + 1 })
              .then(r => {
                uclases = {
                  ...uclases,
                  [clase.id]: moment() > moment(clase.inicio) ? 1 : 0
                }
                const last_class =
                  moment(usuario.last_class).format() >
                  moment(clase.inicio).format()
                    ? moment(usuario.last_class).format()
                    : moment(clase.inicio).format()
                if (!isIlimitado) {
                  const creditos = clase.costo ? clase.costo : 1
                  ucreditos = {
                    ...ucreditos,
                    [clase.gimnasio.id]:
                      ucreditos[clase.gimnasio.id] - +creditos
                  }

                  if (invitado) invitado = !invitado
                  return usuarioRef
                    .update({
                      creditos: { ...ucreditos },
                      clases: uclases,
                      last_class,
                      invitado
                    })
                    .then(r => {
                      return 202
                    })
                    .catch(e => 404)
                } else {
                  return usuarioRef
                    .update({ clases: uclases, last_class })
                    .then(r => 202)
                    .catch(e => 404)
                }
              })
              .catch(e => 404)
          })
          .catch(e => 404)
      } else {
        return 404
      }
    })
  })
}

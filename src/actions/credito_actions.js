import { db } from './firebase-config'
import moment from 'moment'

export const asignarInscripcion = ({ uid, correo, nombre, tipo }) => {
  return db
    .ref('usuario')
    .child(uid)
    .once('value')
    .then(snap => {
      const usuario = snap.val()
      return db
        .ref('pago')
        .push({
          name: 'Suscripción',
          uid,
          fecha: moment().format(),
          nombre: usuario.nombre,
          precio: 600,
          metodo: 'Admin',
          last4: tipo,
          tarjeta: 'Sucursal',
          correo,
          usuario: nombre
        })
        .then(pid => {
          const id = pid.key
          let { pagos } = usuario
          if (typeof pagos === 'undefined') pagos = {}
          return db
            .ref('usuario')
            .child(uid)
            .update({
              pagos: { ...pagos, [id]: true },
              last_class: moment().format(),
              status: 1
            })
            .then(r => 202)
            .catch(e => 404)
        })
        .catch(e => 404)
    })
}

export const asignarCreditos = ({
  creditos: compra,
  uid,
  model,
  sid,
  paquete,
  sucursal,
  correo,
  tipo,
  usuario
}) => {
  const ref = db.ref(model).child(uid)
  return ref.once('value').then(r => {
    let { creditos, pagos, ilimitado } = r.val()
    let screditos = 0
    if (typeof creditos !== 'undefined')
      screditos = creditos[sid] + +paquete.creditos
    if (typeof pagos === 'undefined') pagos = {}
    return db
      .ref('pago')
      .push({
        ...paquete,
        name: paquete.nombre,
        sucursal: sucursal.nombre,
        uid,
        fecha: moment().format(),
        metodo: 'Admin',
        last4: tipo,
        tarjeta: 'Sucursal',
        correo,
        usuario
      })
      .then(r => {
        const pid = r.key
        pagos = { ...pagos, [pid]: true }
        if (paquete.meses) {
          let inicio, fin
          const now = moment()
          if (typeof ilimitado === 'undefined') {
            inicio = now.format()
            fin = now.add(paquete.meses, 'M')
          } else {
            if (moment(fin).format() < now.format()) {
              inicio = now.format()
              fin = now.add(paquete.meses, 'M')
            } else {
              inicio = ilimitado['inicio']
              fin = moment(ilimitado.fin).add(paquete.meses, 'M')
            }
          }
          return ref
            .update({
              ilimitado: {
                inicio: moment(inicio).format(),
                fin: moment(fin).format()
              },
              pagos
            })
            .then(r => 202)
            .catch(e => 404)
        } else {
          return ref
            .update({
              creditos: { ...creditos, [sid]: screditos },
              pagos
            })
            .then(r => 202)
            .catch(e => 404)
        }
      })
      .catch(e => 404)
  })
}

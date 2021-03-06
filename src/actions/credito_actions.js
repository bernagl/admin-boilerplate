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
          usuario: nombre,
          type: 'subscripcion'
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
  paquete: paq,
  sucursal,
  correo,
  tipo,
  usuario
}) => {
  const paquete = { ...paq }
  delete paquete['id']
  const ref = db.ref(model).child(uid)
  return ref.once('value').then(r => {
    let { creditos, pagos, expires, ilimitado } = r.val()
    expires =
      moment(expires) > moment()
        ? moment(expires)
            .add('M', paquete.meses ? paquete.meses : 1)
            .format()
        : moment()
            .add('M', paquete.meses ? paquete.meses : 1)
            .format()

    let screditos = 0
    if (typeof creditos !== 'undefined')
      screditos = creditos[sid]
        ? +creditos[sid] + +paquete.creditos
        : +paquete.creditos
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
        usuario,
        type: 'paquete'
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
            if (ilimitado[sid]) {
              if (ilimitado[sid].fin < now) {
                inicio = now.format()
                fin = now.add(paquete.meses, 'M')
              } else {
                inicio = ilimitado[sid].inicio
                fin = moment(ilimitado[sid].fin).add(paquete.meses, 'M')
              }
            } else {
              inicio = now.format()
              fin = moment().add(paquete.meses, 'M')
            }
          }
          const ilimitadoSucursal = {
            inicio: moment(inicio).format(),
            fin: moment(fin).format()
          }
          // returnss
          return ref
            .update({
              ilimitado: ilimitado
                ? { ...ilimitado, [sid]: ilimitadoSucursal }
                : { [sid]: ilimitadoSucursal },
              expires,
              pagos
            })
            .then(r => 202)
            .catch(e => console.log(e))
        } else {
          return ref
            .update({
              creditos: { ...creditos, [sid]: screditos },
              expires,
              pagos
            })
            .then(r => 202)
            .catch(e => console.log(e))
        }
      })
      .catch(e => console.log(e))
  })
}

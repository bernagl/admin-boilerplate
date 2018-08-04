import { db } from './firebase-config'
import moment from 'moment'

export const asignarCreditos = ({
  creditos: compra,
  id,
  model,
  sid,
  paquete,
  sucursal,
  tipo
}) => {
  const ref = db.ref(model).child(id)
  return ref.once('value').then(r => {
    let { creditos, pagos } = r.val()
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
        id,
        fecha: moment().format(),
        metodo: 'Admin',
        last4: tipo,
        tarjeta: 'Sucursal'
      })
      .then(r => {
        const pid = r.key
        return ref
          .update({
            creditos: { ...creditos, [sid]: screditos },
            pagos: { ...pagos, [pid]: true }
          })
          .then(r => 202)
          .catch(e => 404)
      })
      .catch(e => 404)
    // return ref
    //   .child('clases')
    //   .push({ fecha: new Date(), compra, metodo: 'Admin' })
    //   .then(r => {
    // return db
    //   .ref('pago')
    //   .push({
    //     ...paquete,
    //     id,
    //     fecha: moment().format(),
    //     metodo: 'Admin',
    //     tarjeta: 'Efectivo'
    //   })
    //   .then(r => 202)
    //   .catch(e => 404)
    // })
    // .catch(e => 404)
  })
}

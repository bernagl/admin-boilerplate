import { db } from './firebase-config'

export const asignarCreditos = ({ creditos: compra, id, model }) => {
  const ref = db.ref(model).child(id)
  return ref.once('value').then(r => {
    let { creditos } = r.val()
    creditos = creditos ? +creditos + +compra : +compra
    return ref
      .update({ creditos })
      .then(r => {
        return ref
          .child('clases')
          .push({ fecha: new Date(), compra, metodo: 'Admin' })
          .then(r => {
            return db
              .ref('pago')
              .push({
                id,
                compra,
                fecha: new Date(),
                metodo: 'Admin'
              })
              .then(r => 202)
              .catch(e => 404)
          })
          .catch(e => 404)
      })
      .catch(e => 404)
  })
}

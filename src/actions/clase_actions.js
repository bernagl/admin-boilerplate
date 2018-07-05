import { db } from './firebase-config'

export const cancelarClase = ({ clase, motivo }) => {
  const ref = db.ref('horario').child(clase.id)
  return ref
    .once('value')
    .then(snapshot => {
      // const clase = snapshot.val()
      return ref
        .update({ status: 2 })
        .then(r => 202)
        .catch(e => 404)
    })
    .catch(e => 404)
}

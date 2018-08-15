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

export const getUsuarios = id => {
  return db
    .ref('horario')
    .child(id)
    .once('value')
    .then(async snap => {
      let { inscritos } = snap.val()
      const usuarios = []
      if (typeof inscritos === 'undefined') inscritos = {}
      const usuariosPromise = Object.keys(inscritos).map(uid => {
        if (inscritos[uid]) {
          return db
            .ref('usuario')
            .child(uid)
            .once('value')
            .then(usnap => ({ ...usnap.val(), id: usnap.key }))
        }
      })

      const usuariosResolve = await Promise.all(usuariosPromise)
      return usuariosResolve.filter(v => v && v)
    })
}

export const getGanancias = () => {
  return db
    .ref('pago')
    .once('value')
    .then(snapshot => {
      let total = 0
      snapshot.forEach(pago => {
        const { precio } = pago.val()
        total += Number(precio)
      })
      return total
    })
}

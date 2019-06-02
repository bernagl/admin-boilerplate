import { db } from './firebase-config'

export const cancelarClase = ({ clase, motivo, usuarios }) => {
  const sid = clase.gimnasio.id
  const ref = db.ref('horario').child(clase.id)
  return ref
    .once('value')
    .then(snapshot => {
      return ref
        .update({ status: 2 })
        .then(async r => {
          if (usuarios) {
            const responsePromise = usuarios.map(async ({ id }) => {
              const userRef = db.ref('usuario').child(id)
              await userRef.once('value', usnap => {
                const user = usnap.val()
                let creditos = +user.creditos[sid] + 1
                userRef.update({
                  creditos: { ...user.creditos, [sid]: creditos }
                })
              })
            })

            await Promise.all(responsePromise)
          }
          return 202
        })
        .catch(e => {
          console.log(e)
          return 404
        })
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

export const getQeue = id => {
  return db
    .ref('horario')
    .child(id)
    .once('value')
    .then(async snap => {
      let { espera } = snap.val()
      const usuarios = []
      if (typeof espera === 'undefined') espera = {}
      const usuariosPromise = Object.keys(espera).map(uid => {
        if (espera[uid]) {
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

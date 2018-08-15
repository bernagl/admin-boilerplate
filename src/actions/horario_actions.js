import { db } from './firebase-config'

export const createHorario = horario => {
  return db
    .ref('horario')
    .push(horario)
    .then(r => 202)
}

export const getSalones = gimnasio => {
  const ref = db.ref('salon')
  return ref
    .orderByChild('sucursal')
    .equalTo(gimnasio)
    .once('value')
    .then(snapshot => {
      const salones = []
      snapshot.forEach(snap => {
        salones.push({ id: snap.key, ...snap.val() })
      })
      return salones
    })
}

export const getDates = (start, end, moment) => {
  var arr = new Array(),
    dt = new Date(start),
    de = new Date(end)
  while (dt <= de) {
    arr.push(moment(dt).format('YYYY-MM-DD'))
    dt.setDate(dt.getDate() + 1)
  }
  return arr
}

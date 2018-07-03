import { db } from './firebase-config'

export const createHorario = horario => {
  console.log('horario', horario)
  return db
    .ref('horario')
    .push(horario)
    .then(r => 202)
}

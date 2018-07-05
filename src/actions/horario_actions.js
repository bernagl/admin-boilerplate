import { db } from './firebase-config'

export const createHorario = horario => {
  return db
    .ref('horario')
    .push(horario)
    .then(r => 202)
}

import { db } from './firebase-config'

export const getDocumentsByModel = model => {
  const data = []
  return db
    .ref(model)
    .once('value', snapshot => {
      snapshot.forEach(document => {
        data.push({ key: document.key, ...document.val() })
      })
    })
    .then(r => data)
    .catch(e => e)
}

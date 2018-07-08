import { db } from './firebase-config'

export const getDocumentsByModel = model => {
  let data = []
  return db
    .ref(model)
    .once('value')
    .then(snapshot => {
      data = []
      snapshot.forEach(document => {
        data.push({ id: document.key, ...document.val() })
      })
      return data
    })
    .catch(e => e)
}

export const getDocument = collection => id => {
  return db
    .ref(collection)
    .child(id)
    .once('value')
    .then(snapshot => ({ id: snapshot.key, ...snapshot.val() }))
    .catch(e => 404)
}

export const addDocument = collection => document => {
  return db
    .ref(collection)
    .push({ status: 1, ...document })
    .then(r => 202)
    .catch(e => 404)
}

export const updateDocument = collection => data => {
  console.log(collection, data)
  return db
    .ref(collection)
    .child(data.id)
    .update({ ...data })
    .then(r => 202)
    .catch(e => 404)
}

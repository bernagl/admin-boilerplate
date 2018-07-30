import { storage } from './firebase-config'

export const uploadImage = (model, file) => {
  const path = +new Date() + '' + file.name
  const ref = storage.ref(path)
  return ref.put(file).then(snapshot => ref.getDownloadURL().then(url => url))
}

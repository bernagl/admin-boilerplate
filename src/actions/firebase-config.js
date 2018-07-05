import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import credentials from './credentials'

const config = {
  apiKey: credentials.apiKey,
  authDomain: credentials.authDomain,
  databaseURL: credentials.databaseURL,
  projectId: credentials.projectId,
  storageBucket: credentials.storageBucket,
  messagingSenderId: credentials.messagingSenderId
}

firebase.initializeApp(config)

export const db = firebase.database()
export const auth = firebase.auth()
import { auth, db } from './firebase-config'
import { message } from 'antd'
import moment from 'moment'

export const login = async (correo, contrasena) => {
  try {
    const { user } = await auth.signInWithEmailAndPassword(correo, contrasena)
    return db
      .ref(`admin/${user.uid}`)
      .once('value')
      .then(result => {
        const usuario = result.val()
        if (usuario) return 202
        else return 404
      })
  } catch (e) {
    return 404
  }
}

export const register = async (correo, contrasena, nombre) => {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(
      correo,
      contrasena
    )
    return db
      .ref(`admin/${user.uid}`)
      .set({ correo, nombre, admin: true })
      .then(result => 202)
  } catch ({ code }) {
    var errorText = ''
    switch (code) {
      case 'auth/invalid-email':
        errorText = 'El correo es inválido'
        break
      case 'auth/weak-password':
        errorText = 'La contraseña es muy sencilla, intenta con otra'
        break
      case 'auth/email-already-in-use':
        errorText = 'El correo ya está en uso, prueba con otro'
        break
      default:
        errorText = 'Ocurrió un error, por favor vuelve a intentarlo'
        break
    }
    message.error(errorText)
    return 404
  }
}

export const registerUser = async ({
  correo,
  contrasena,
  nombre,
  telefono,
  edad
}) => {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(
      correo,
      contrasena
    )
    return db
      .ref(`usuario/${user.uid}`)
      .set({
        correo,
        edad,
        nombre,
        status: 1,
        telefono,
        clases: {},
        creditos: { '-LJ5w7hFuZxYmwiprTIY': 1 },
        created_at: moment().format(),
        tarjetas: {},
        invitado: true
      })
      .then(result => {
        message.success('Usuario agregado correctamente')
        return 202
      })
  } catch ({ code }) {
    var errorText = ''
    switch (code) {
      case 'auth/invalid-email':
        errorText = 'El correo es inválido'
        break
      case 'auth/weak-password':
        errorText = 'La contraseña es muy sencilla, intenta con otra'
        break
      case 'auth/email-already-in-use':
        errorText = 'El correo ya está en uso, prueba con otro'
        break
      default:
        errorText = 'Ocurrió un error, por favor vuelve a intentarlo'
        break
    }
    message.error(errorText)
    return 404
  }
}

export const authState = async context => {
  auth.onAuthStateChanged(user => {
    if (user) {
      return db
        .ref(`admin/${user.uid}`)
        .once('value')
        .then(result => {
          const usuario = result.val()
          if (usuario) {
            context.setState({
              auth: { correo: user.email, uid: user.uid },
              loading: false
            })
          } else {
            logout()
            return 404
          }
        })
    } else {
      context.setState({ auth: null, loading: false })
    }
  })
}

export const logout = () => {
  auth
    .signOut()
    .then(() => console.log('logout'))
    .catch(e => console.log(e))
}

export const recover = correo => {
  return auth
    .sendPasswordResetEmail(correo)
    .then(r => 202)
    .catch(e => 404)
}
import React, { Component } from 'react'
import AuthWrapper from '../components/AuthWrapper'
import Input from '../components/Input'
import { message } from 'antd'
import { login } from '../actions/firebase_auth'
import { Link } from 'react-router-dom'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
  }

  submit = async ({ correo, contrasena }) => {
    const response = await login(correo, contrasena)
    if (response === 404) message.error('Usuario y/o contraseña incorrectos')
    else if (response === 202) message.success('Bienvenido')
    return response
  }

  Links = () => (
    <React.Fragment>
      <div className="col-12 col-md-4 col-lg-4 mt-4">
        <Link to="/registro">Registro</Link>
      </div>
      <div className="col-12 col-md-8 col-lg-8  mt-4">
        <Link to="/recover">Recuperar contraseña</Link>
      </div>
    </React.Fragment>
  )

  render() {
    return (
      <AuthWrapper
        submit={this.submit}
        title="Iniciar sesión"
        Links={this.Links}
      >
        <Input
          name="correo"
          label="Correo"
          validations="isEmail"
          validationError="Ingresa un correo válido"
          required
        />
        <Input
          name="contrasena"
          label="Contraseña"
          validations="minLength:6"
          validationError="Ingresa una contraseña válida"
          required
          type="password"
        />
      </AuthWrapper>
    )
  }
}

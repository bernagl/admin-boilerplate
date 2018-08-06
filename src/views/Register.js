import React, { Component } from 'react'
import AuthWrapper from '../components/AuthWrapper'
import Input from '../components/Input'
import { message } from 'antd'
import { register } from '../actions/firebase_auth'
import { Link } from 'react-router-dom'

export default class Registro extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
  }

  submit = async ({ correo, contrasena, nombre }) => {
    const response = await register(correo, contrasena, nombre)
    if (response === 202) message.success('Bienvenido')
    return response
  }

  Links = () => (
    <React.Fragment>
      <div className="col-12 mt-4">
        <Link to="/login">Login</Link>
      </div>
      {/* <div className="col-12 col-md-8 col-lg-8  mt-4">
        <Link to="/recover">Recuperar contra</Link>
      </div> */}
    </React.Fragment>
  )

  render() {
    return (
      <AuthWrapper submit={this.submit} title="Registro" Links={this.Links}>
        <Input
          name="nombre"
          label="Nombre completo"
          validations="minLength:3"
          validationError="Ingresa un nombre válido"
          required
        />
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
        <Input
          name="confirmar"
          label="Confirmar contraseña"
          validations="equalsField:contrasena"
          validationError="Lcas contraseñas no coinciden"
          required
          type="password"
        />
      </AuthWrapper>
    )
  }
}

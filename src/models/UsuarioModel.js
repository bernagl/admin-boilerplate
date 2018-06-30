import React from 'react'
import Input from '../components/Input'

export default ({ nombre, correo, contrasena }) => {
  return (
    <React.Fragment>
      <Input
        name="nombre"
        label="Nombre"
        value={nombre}
        validations="minLength:3"
        validationError="Ingresa un nombre válido"
        required
      />
      <Input
        name="correo"
        label="Correo"
        value={correo}
        validations="isEmail"
        validationError="Ingresa un email válido"
        required
      />
      <Input
        name="contrasena"
        label="Contraseña"
        value={contrasena}
        validations="minLength:6"
        type="password"
        validationError="Ingresa una contraseña válida"
        required
      />
      <Input
        name="confirmar"
        label="Confirmar contraseña"
        validations="equalsField:contrasena"
        type="password"
        validationError="Las contraseñas no coinciden"
        required
      />
    </React.Fragment>
  )
}

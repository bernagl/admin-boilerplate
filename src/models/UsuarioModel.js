import React from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import Input from '../components/Input'
import { registerUser } from '../actions/firebase_auth'

export default () => {
  return (
    <Datatable
      model="usuario"
      Inputs={Inputs}
      Columns={Columns}
      submit={submit}
    />
  )
}

const submit = async model => {
  // return { direccion: { calle: model.nombre, cp: model.contrasena }, ...model }
  const response = registerUser(model)
  if(response) return false
}

const Columns = showModal => {
  return [
    {
      label: 'Nombre',
      key: 'nombre',
      Render: element => <span>{element.nombre}</span>
    },
    { label: 'Correo', key: 'correo' },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => (
        <DatatableActions
          model="usuario"
          selected={selected}
          showModal={showModal}
        />
      )
    }
  ]
}

const Inputs = ({ nombre, edad, telefono, correo, contrasena }) => {
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
        name="edad"
        label="Edad"
        value={edad}
        validations={{ maxLength: 2, isNumeric: true }}
        validationError="Ingresa una edad válida"
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
        name="telefono"
        label="Teléfono"
        value={telefono}
        validations={{ maxLength: 10, isNumeric: true }}
        validationError="Ingresa un número de teléfono válido"
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

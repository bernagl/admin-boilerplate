import React from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import Input from '../components/Input'

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

const submit = model => {
  return { direccion: { calle: model.nombre, cp: model.contrasena }, ...model }
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

const Inputs = ({ nombre, correo, contrasena }) => {
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
      {!nombre && (
        <Input
          name="creditos"
          label="Créditos"
          value={10}
          validations="isNumeric"
          validationError="Ingresa una cantidad de créditos válida"
          required
        />
      )}
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

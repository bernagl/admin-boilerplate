import React from 'react'
import Datatable from '../components/Datatable'
import Input from '../components/Input'

export default () => {
  return (
    <Datatable
      model="instructor"
      Inputs={Inputs}
      Columns={Columns}
      submit={submit}
    />
  )
}

const submit = model => {
  return model
}

const Columns = showModal => {
  return [
    {
      label: 'Nombre',
      key: 'nombre',
      Render: element => <span>{element.nombre}</span>
    },
    { label: 'Apellido', key: 'apellido' },
    { label: 'Correo', key: 'correo' },
    { label: 'Teléfono', key: 'telefono' },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => <span onClick={() => showModal(selected)}>View</span>
    }
  ]
}

const Inputs = ({ nombre, apellido, correo, telefono }) => {
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
        name="apellido"
        label="Apellidos"
        value={apellido}
        validations="minLength:3"
        validationError="Ingresa un apellido válido"
        required
      />
      <Input
        name="correo"
        label="Correo"
        value={correo}
        validations="isEmail"
        validationError="Ingresa un correo válido"
        required
      />
      <Input
        name="telefono"
        label="Teléfono"
        value={telefono}
        validations="isNumeric"
        validationError="Ingresa un número de teléfono válido"
        required
      />
    </React.Fragment>
  )
}

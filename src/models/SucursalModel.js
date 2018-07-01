import React from 'react'
import Input from '../components/Input'

export const SucursalTable = showModal => {
  return [
    {
      label: 'Nombre',
      key: 'nombre',
      Render: element => <span>{element.nombre}</span>
    },
    { label: 'Ciudad', key: 'ciudad' },
    { label: 'Colonia', key: 'colonia' },
    { label: 'Número', key: 'numero' },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => <span onClick={() => showModal(selected)}>View</span>
    }
  ]
}

export const SucursalForm = ({ nombre, ciudad, calle, colonia, numero }) => {
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
        name="ciudad"
        label="Ciudad"
        value={ciudad}
        validations="minLength:3"
        validationError="Ingresa una ciudad válida"
        required
      />
      <Input
        name="calle"
        label="Calle"
        value={calle}
        validations="minLength:3"
        validationError="Ingresa una calle válida"
        required
      />
      <Input
        name="colonia"
        label="Colonia"
        value={colonia}
        validations="minLength:3"
        validationError="Ingresa una colonia válida"
        required
      />
      <Input
        name="numero"
        label="Número"
        value={numero}
        validations="minLength:3"
        validationError="Ingresa un numero válido"
        required
      />
    </React.Fragment>
  )
}

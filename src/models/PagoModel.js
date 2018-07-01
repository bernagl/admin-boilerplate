import React from 'react'
import Input from '../components/Input'

export const PagoTable = showModal => {
  return [
    {
      label: 'Nombre',
      key: 'nombre',
      Render: element => <span>{element.nombre}</span>
    },
    { label: 'Correo', key: 'correo' },
    { label: 'Contraseña', key: 'contrasena' },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => <span onClick={() => showModal(selected)}>View</span>
    }
  ]
}

export const PagoForm = ({ id, nombre, correo, contrasena }) => {
  return (
    <React.Fragment>
      <h5>
        Id: <span>{id}</span>
      </h5>
    </React.Fragment>
  )
}

import React from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import moment from 'moment'

export default () => {
  return (
    <Datatable
      model="pago"
      title="Detalles del pago"
      Inputs={Inputs}
      showHideDisabled={true}
      Columns={Columns}
      download={true}
      submit={submit}
    />
  )
}

const submit = model => {
  return model
}

const Columns = showModal => {
  return [
    // { label: 'Usuario', key: 'nombre' },
    { label: 'Créditos', key: 'creditos' },
    { label: 'Tipo', key: 'tipo', Render: ({ name }) => <span>{name}</span> },
    {
      label: 'Precio',
      key: 'precio',
      Render: ({ precio }) => <span>MXN${precio}</span>
    },
    {
      label: 'Fecha',
      key: 'fecha',
      Render: ({ fecha }) => <span>{moment(fecha).format('LL')}</span>
    },
    {
      label: 'Método',
      key: 'metodo',
      Render: ({ tarjeta, last4 }) => (
        <span>
          {tarjeta} - {last4}
        </span>
      )
    },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => (
        <DatatableActions showModal={showModal} selected={selected} />
      )
    }
  ]
}

const Inputs = ({
  nombre,
  correo,
  telefono,
  paquete,
  precio,
  creditos,
  fecha
}) => {
  return (
    <React.Fragment>
      <p>Usuario: {nombre}</p>
      <p>Correo: {correo}</p>
      <p>Teléfono: {telefono}</p>
      <p>Paquete: {paquete}</p>
      <p>Precio: {precio}</p>
      <p>Fecha: {fecha}</p>
      <p>Créditos: {creditos}</p>
      <p>Fecha: {fecha}</p>
    </React.Fragment>
  )
}

import React from 'react'
import Datatable from '../components/Datatable'
import Input from '../components/Input'

export default () => {
  return (
    <Datatable
      model="pago"
      title="Detalles del pago"
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
    { label: 'Créditos', key: 'creditos' },
    { label: 'Fecha', key: 'fecha' },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => <span onClick={() => showModal(selected)}>View</span>
    }
  ]
}

const Inputs = ({ creditos, fecha }) => {
  return (
    <React.Fragment>
      <p>Créditos: {creditos}</p>
      <p>Fecha: {fecha}</p>
    </React.Fragment>
  )
}

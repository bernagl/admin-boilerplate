import React from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import Input from '../components/Input'

export default () => {
  return (
    <Datatable
      model="clase"
      Inputs={Inputs}
      Columns={Columns}
      submit={submit}
    />
  )
}

const submit = model => {
  return model
}

const Columns = (showModal, setDataToState) => {
  return [
    {
      label: 'Nombre',
      key: 'nombre',
      Render: element => <span>{element.nombre}</span>
    },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => (
        <DatatableActions
          model="clase"
          selected={selected}
          showModal={showModal}
          setDataToState={setDataToState}
        />
      )
    }
  ]
}

const Inputs = ({ nombre }) => {
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
    </React.Fragment>
  )
}

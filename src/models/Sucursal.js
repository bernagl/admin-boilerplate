import React from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import Input from '../components/Input'

export default () => {
  return (
    <Datatable
      model="sucursal"
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
      key: 'nombre'
      // Render: element => <span>{element.nombre}</span>
    },
    { label: 'Ciudad', key: 'ciudad' },
    { label: 'Colonia', key: 'colonia' },
    { label: 'Número', key: 'numero' },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => (
        <DatatableActions
          model="sucursal"
          selected={selected}
          showModal={showModal}
          setDataToState={setDataToState}
        />
      )
      // Render: selected => <span onClick={() => showModal(selected)}>View</span>
    }
  ]
}

const Inputs = ({ nombre, ciudad, calle, colonia, numero }) => {
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

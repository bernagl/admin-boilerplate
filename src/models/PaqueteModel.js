import React, { Component } from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import Input from '../components/Input'
import Select from '../components/Select'
import { getDocumentsByModel } from '../actions/firebase_actions'

export default class SalonModel extends Component {
  state = { gimnasios: [] }
  async componentDidMount() {
    const gimnasios = await getDocumentsByModel('sucursal')
    this.setState({ gimnasios })
  }

  submit = model => {
    const { sucursal } = this.state
    return { ...model, sucursal }
  }

  render() {
    const { gimnasios } = this.state
    return (
      <Datatable
        model="paquete"
        Inputs={Inputs({ gimnasios, context: this })}
        Columns={Columns}
        submit={this.submit}
      />
    )
  }
}

const Columns = (showModal, setDataToState) => {
  return [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Creditos', key: 'creditos' },
    {
      label: 'Precio',
      key: 'precio',
      Render: ({ precio }) => <span>MXN{precio}</span>
    },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => (
        <DatatableActions
          model="paquete"
          selected={selected}
          showModal={showModal}
          setDataToState={setDataToState}
        />
      )
    }
  ]
}

const Inputs = ({ gimnasios, context }) => ({
  nombre,
  creditos,
  precio,
  sucursal,
  meses
}) => {
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
        name="creditos"
        label="Créditos"
        value={creditos}
        validations="isNumeric"
        validationError="Ingresa un credito válido"
      />
      <Input
        name="meses"
        label="Paquete ilímitado (meses)"
        value={meses}
        validations={{ isNumeric: true, maxLength: 2 }}
        validationError="Ingresa un valor válido"
      />
      <Input
        name="precio"
        label="Precio"
        value={precio}
        validations="isNumeric"
        validationError="Ingresa un precio válido"
        required
      />
      <Select
        placeholder="Selecciona una sucursal"
        defaultValue={sucursal}
        options={gimnasios}
        name="sucursal"
        context={context}
        label="Sucursal"
      />
    </React.Fragment>
  )
}

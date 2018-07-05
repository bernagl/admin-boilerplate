import React, { Component } from 'react'
import Datatable from '../components/Datatable'
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
        model="salon"
        Inputs={Inputs({ gimnasios, context: this })}
        Columns={Columns}
        submit={this.submit}
      />
    )
  }
}

const Columns = showModal => {
  return [
    {
      label: 'Nombre',
      key: 'nombre',
      Render: element => <span>{element.nombre}</span>
    },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => <span onClick={() => showModal(selected)}>View</span>
    }
  ]
}

const Inputs = ({ gimnasios, context }) => ({ nombre, sucursal }) => {
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

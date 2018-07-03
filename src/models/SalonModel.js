import React, { Component } from 'react'
import { Form as F } from 'antd'
import Datatable from '../components/Datatable'
import Input from '../components/Input'
import Select from '../components/Select'
import { getDocumentsByModel } from '../actions/firebase_actions'

const { Item } = F

export default class SalonModel extends Component {
  state = { gimnasios: [] }
  async componentDidMount() {
    const gimnasios = await getDocumentsByModel('sucursal')
    this.setState({ gimnasios })
  }

  render() {
    const { nombre, gimnasios } = this.state
    return (
      <Datatable
        model="salon"
        Inputs={Inputs(gimnasios)}
        Columns={Columns}
        submit={submit}
      />
    )
  }
}

const submit = model => {
  console.log(model)
  return model
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

const Inputs = gimnasios => ({ nombre, sucursal }) => {
  let s = sucursal
  return (
    <React.Fragment>
      <Item label="Sucursal">
        <Select
          placeholder="Selecciona una sucursal"
          defaultValue={sucursal}
          options={gimnasios}
          name="sucursal"
          // onChange={sucursal => (s = sucursal)}
        >
          {/* {gimnasios.map(({ id, nombre }) => (
            <Option key={id}>{nombre}</Option>
          ))} */}
        </Select>
      </Item>
      <Input type="hidden" name="sucursal" value={s} />
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

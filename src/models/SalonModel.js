import React from 'react'
import Datatable from '../components/Datatable'
import Input from '../components/Input'
import { getDocumentsByModel } from '../actions/firebase_actions'

export default class SalonModel extends Component {
  async componentDidMount() {
    const gimnasios = await getDocumentsByModel('gimnasio')
    this.setState({ gimnasios })
  }

  render() {
    const { gimnasios } = this.state
    return (
      <Datatable
        model="clase"
        Inputs={Inputs(gimnasios)}
        Columns={Columns}
        submit={submit}
      />
    )
  }
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
    {
      label: 'Gimnasio',
      Render: element => <span>{element.gimnasio.nombre}</span>
    },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => <span onClick={() => showModal(selected)}>View</span>
    }
  ]
}

const Inputs = ({ nombre, gimnasios }) => {
  return (
    <React.Fragment>
      <Select>
        {gimnasios.map((gimnasio, key) => (
          <Option key={key}>{gimnasio.nombre}</Option>
        ))}
      </Select>
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

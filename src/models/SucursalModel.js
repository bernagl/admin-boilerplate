import React from 'react'
import Input from '../components/Input'
import { Link } from 'react-router-dom'
import { getDocument } from '../actions/firebase_actions'
import Form from '../components/Form2'

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
      Render: selected => <Link to={`/sucursal/${selected.id}`}>View</Link>
    }
  ]
}

export class SucursalForm extends React.Component {
  state = {
    sucursal: null
  }
  async componentDidMount() {
    const { id } = this.props.match.params
    const sucursal = await getDocument('sucursal')(id)
    this.setState({ sucursal })
  }

  render() {
    const { sucursal } = this.state
    const { nombre, ciudad, calle, colonia, numero } = sucursal
      ? sucursal
      : { nombre, ciudad, calle, colonia, numero }
    const { id } = this.props.match.params
    return (
      <Form>
        {id && sucursal ? (
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="col-12">
                  <Input
                    name="nombre"
                    label="Nombre"
                    value={nombre}
                    validations="minLength:3"
                    validationError="Ingresa un nombre válido"
                    required
                  />
                </div>
                <div className="col-12">
                  <Input
                    name="ciudad"
                    label="Ciudad"
                    value={ciudad}
                    validations="minLength:3"
                    validationError="Ingresa una ciudad válida"
                    required
                  />
                </div>
                <div className="col-12">
                  <Input
                    name="calle"
                    label="Calle"
                    value={calle}
                    validations="minLength:3"
                    validationError="Ingresa una calle válida"
                    required
                  />
                </div>
                <div className="col-12">
                  <Input
                    name="colonia"
                    label="Colonia"
                    value={colonia}
                    validations="minLength:3"
                    validationError="Ingresa una colonia válida"
                    required
                  />
                </div>
                <div className="col-12">
                  <Input
                    name="numero"
                    label="Número"
                    value={numero}
                    validations="minLength:3"
                    validationError="Ingresa un numero válido"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <span>Cargando</span>
        )}
      </Form>
    )
  }
}

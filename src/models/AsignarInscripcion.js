import React, { Component } from 'react'
import { AutoComplete, Button, message, Select } from 'antd'
import AnimationWrapper from '../components/AnimationWrapper'
import { getDocumentsByModel } from '../actions/firebase_actions'
import { asignarInscripcion } from '../actions/credito_actions'

export default class Horario extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      data: [],
      dataSource: [],
      usuarios: [],
      usuario: null,
      tipo: null
    }
  }

  async componentDidMount() {
    const data = await getDocumentsByModel('usuario')
    const paquetes = await getDocumentsByModel('paquete')
    const sucursales = await getDocumentsByModel('sucursal')
    const usuarios = data.map(({ correo }) => correo)
    this.setState({ dataSource: data, usuarios, sucursales, paquetes })
  }

  submit = async () => {
    const { dataSource, usuario: correo, tipo } = this.state
    if (!correo) {
      message.error('El usuario es requerido')
      return
    }
    const { id } = dataSource.find(usuario => usuario.correo === correo)
    const response = await asignarInscripcion({ uid: id, correo, tipo })
    response === 202
      ? message.success('Inscripción actualizada')
      : message.error('Ocurrió un error, por favor vuelve a intentarlo')
  }

  setValue = (key, value) => {
    this.setState({ [key]: value })
  }

  handleSearch = value => {
    const { usuarios } = this.state
    const data = usuarios.filter(
      (usuario, key) => usuario && usuario.search(value) >= 0 && usuario
    )

    this.setState({ data })
  }

  render() {
    const { data } = this.state
    return (
      <AnimationWrapper>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-6">
                {/* <Item label="Usuario" layout="vertical"> */}
                <AutoComplete
                  dataSource={data}
                  placeholder="Seleccionar usuario"
                  onSearch={this.handleSearch}
                  className="fw"
                  onSelect={usuario => this.setValue('usuario', usuario)}
                />
                {/* </Item> */}
              </div>
              <div className="col-6">
                <Select
                  placeholder="Método de pago"
                  onChange={tipo => this.setState({ tipo })}
                  className="fw"
                >
                  <Select.Option key="Terminal">Terminal</Select.Option>
                  <Select.Option key="Efectivo">Efectivo</Select.Option>
                </Select>
              </div>
              <div className="col-6 my-3">
                <Button type="primary" onClick={this.submit}>
                  Asignar créditos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    )
  }
}

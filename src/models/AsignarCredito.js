import React, { Component } from 'react'
import { AutoComplete, Button, Form as F, message, InputNumber } from 'antd'
import AnimationWrapper from '../components/AnimationWrapper'
import { getDocumentsByModel } from '../actions/firebase_actions'
import { asignarCreditos } from '../actions/credito_actions'
const { Item } = F

export default class Horario extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      creditos: 1,
      data: [],
      dataSource: [],
      usuarios: [],
      usuario: null
    }
  }

  async componentDidMount() {
    const data = await getDocumentsByModel('usuario')
    const usuarios = data.map(({ correo }) => correo)
    this.setState({ dataSource: data, usuarios })
  }

  submit = async () => {
    const { creditos, usuario: correo, dataSource } = this.state
    if (!correo) {
      message.error('El usuario es requerido')
      return
    }

    const { id } = dataSource.find(usuario => usuario.correo === correo)
    const response = await asignarCreditos({ model: 'usuario', creditos, id })
    console.log(response)
    message.success('Clases guardadas correctamente')
  }

  setValue = (key, value) => {
    this.setState({ [key]: value })
  }

  handleSearch = value => {
    const { usuarios } = this.state
    const data = usuarios.filter(
      (usuario, key) => usuario.search(value) >= 0 && usuario
    )

    this.setState({ data })
  }

  render() {
    const { data } = this.state
    return (
      <AnimationWrapper>
        <div className="row">
          <div className="col-6">
            <Item label="Usuario" layout="vertical">
              <AutoComplete
                dataSource={data}
                placeholder="Seleccionar usuario"
                onSearch={this.handleSearch}
                className="fw"
                onSelect={usuario => this.setValue('usuario', usuario)}
              />
            </Item>
          </div>
          <div className="col-3">
            <Item label="Créditos" layout="vertical">
              <InputNumber
                min={1}
                max={100}
                defaultValue={1}
                onChange={creditos => this.setValue('creditos', creditos)}
              />
            </Item>
          </div>
          <div className="col-12">
            <Button type="primary" onClick={this.submit}>
              Submit
            </Button>
          </div>
        </div>
      </AnimationWrapper>
    )
  }
}

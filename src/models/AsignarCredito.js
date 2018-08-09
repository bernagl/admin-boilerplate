import React, { Component } from 'react'
import {
  AutoComplete,
  Button,
  Form as F,
  message,
  InputNumber,
  Select
} from 'antd'
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
      usuario: null,
      sucursales: [],
      paquetes: [],
      sselected: 0,
      pselected: 0
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
    const {
      creditos,
      usuario: correo,
      dataSource,
      sselected,
      paquetes,
      pselected,
      sucursales,
      tipo
    } = this.state
    if (!correo) {
      message.error('El usuario es requerido')
      return
    }

    const { id } = dataSource.find(usuario => usuario.correo === correo)
    const paquete = paquetes.find(p => p.id === pselected)
    const sucursal = sucursales.find(suc => suc.id === sselected)
    const response = await asignarCreditos({
      model: 'usuario',
      creditos,
      id,
      correo,
      tipo,
      sid: sselected,
      sucursal,
      paquete
    })
    let text
    if (paquete.meses) {
      text = `El paquete ilímitado de ${
        paquete.meses
      } mes(es) se agregó correctamente`
    } else {
      text = `Se asignaron ${paquete.creditos} creditos correctamente`
    }
    message.success(text)
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
    const { data, paquetes: p, sucursales, sselected } = this.state
    const paquetes = p.filter(paq => sselected === paq.sucursal)
    console.log(this.state)
    return (
      <AnimationWrapper>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-6 my-3">
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
              {/* <div className="col-6">
            <Item label="Créditos" layout="vertical">
              <InputNumber
                min={1}
                max={100}
                defaultValue={1}
                onChange={creditos => this.setValue('creditos', creditos)}
              />
            </Item>
          </div> */}
              <div className="col-6 my-3">
                <Select
                  placeholder="Selecciona una sucursal"
                  onChange={i => this.setState({ sselected: i })}
                  className="fw"
                >
                  {sucursales.map((suc, i) => (
                    <Select.Option key={suc.id}>{suc.nombre}</Select.Option>
                  ))}
                </Select>
              </div>
              <div className="col-6">
                <Select
                  placeholder="Selecciona un paquete"
                  onChange={id => this.setState({ pselected: id })}
                  className="fw"
                >
                  {paquetes.map((paq, i) => (
                    <Select.Option key={paq.id}>{paq.nombre}</Select.Option>
                  ))}
                </Select>
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

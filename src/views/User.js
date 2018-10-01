import React from 'react'
import Tabs from 'antd/lib/tabs'
// import Datepicker from 'antd/lib/date-picker'
import Table from '../components/EraserTable'
import { Popconfirm, Collapse, Button, Popover, Tag } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Clases from '../views/Clases'
import Form from '../Form/Form'
import Input from '../Form/Input'
import TextArea from '../Form/Textarea'
import Datepicker from '../Form/Datepicker'
import { getDocument, getDocumentsByModel } from '../actions/firebase_actions'
import Select from 'antd/lib/select'
import AntdForm from 'antd/lib/form'

const { Option } = Select
const { Item } = AntdForm

const { TabPane } = Tabs
const { Panel } = Collapse

export default class extends React.Component {
  state = { clases: [], user: null, sucursales: [], activeSucursal: 0 }

  async componentDidMount() {
    const { id } = this.props.match.params
    const sucursales = await getDocumentsByModel('sucursal')
    const user = await getDocument('usuario')(id)
    const clasesPromise = Object.keys(user.clases).map(id =>
      getDocument('horario')(id)
    )
    const clases = await Promise.all(clasesPromise)
    this.setState({ clases, user, sucursales })
  }

  logsCol = () => [
    { label: 'Log', key: 'type' },
    { label: 'Fecha', Render: ({ date }) => moment(date).format('LL') },
    { label: 'Usuario', key: 'user' }
  ]

  clasesCol = () => [
    {
      label: 'Clase',
      Render: ({ clase: { nombre } }) => <span>{nombre}</span>
    },
    {
      label: 'Coach',
      Render: ({ instructor: { nombre } }) => <span>{nombre}</span>
    },
    {
      label: 'Fecha',
      key: 'fecha',
      Render: ({ inicio }) => <span>{moment(inicio).format('LL')}</span>
    },
    {
      label: 'Hora',
      key: 'hora',
      Render: ({ inicio }) => <span>{moment(inicio).format('LT')}</span>
    },
    { label: 'Créditos', key: 'costo' },
    {
      label: 'Estatus',
      key: 'status',
      Render: item => {
        return (
          <React.Fragment>
            <Popover
              content={
                <p>
                  {item.status === 0
                    ? 'La fecha aún no se cumple'
                    : item.status === 2
                      ? 'Cancelaste la clase'
                      : item.status === 3
                        ? 'Estas en la lista de espera, si algún usuario cancela se te notificará por correo'
                        : 'La clase ya pasó'}
                </p>
              }
              title={
                item.status === 0
                  ? 'Pendiente'
                  : item.status === 1
                    ? 'Cumplida'
                    : item.status === 3
                      ? 'En cola'
                      : 'Cancelada'
              }
            >
              <Tag
                color={`${
                  item.status === 0
                    ? 'green'
                    : item.status === 3
                      ? 'blue'
                      : 'volcano'
                }`}
              >
                {item.status === 0
                  ? 'Pendiente'
                  : item.status === 2
                    ? 'Cancelada'
                    : item.status === 3
                      ? 'En lista de espera'
                      : 'Cumplida'}
              </Tag>
            </Popover>
            {item.status === 0 && (
              <Popconfirm
                title="¿Deseas cancelar la clase?"
                okText="Si"
                cancelText="No"
                onConfirm={() => this.cancelarClase(item)}
              >
                <Tag color="red">Cancelar</Tag>
              </Popconfirm>
            )}
          </React.Fragment>
        )
      }
    }
  ]

  render() {
    const { clases, user, sucursales, activeSucursal } = this.state
    const hasUnlimited = user ? (user.ilimitado ? true : false) : false
    const unlimitedActive = user
      ? moment() > moment(user.ilimitado.fin)
        ? false
        : true
      : false
    const creditos = user ? user.creditos[sucursales[activeSucursal].id] : 0
    return !user ? (
      <span>Cargando</span>
    ) : (
      <div className="row">
        <div className="col-12">
          <h2>{user.nombre}</h2>
          <Tag color="green">Suscripción activa</Tag>
          <h4>
            {unlimitedActive
              ? `Paquete ilímitado vence: ${moment(user.ilimitado.fin).format(
                  'LL'
                )}`
              : `Créditos ${creditos}`}
          </h4>
        </div>
        <div className="col-12">
          <Tabs defaultActiveKey="1" onChange={e => console.log(e)}>
            <TabPane tab="Perfil" key="1">
              <div className="row">
                <div className="col-6">
                  <div>
                    <Item label="Sucursal">
                      <Select
                        name="sucursal"
                        onChange={activeSucursal =>
                          this.setState({ activeSucursal })
                        }
                        style={{ width: 200 }}
                        defaultValue={sucursales[activeSucursal].id}
                      >
                        {sucursales.map(sucursal => (
                          <Option key={sucursal.id}>{sucursal.nombre}</Option>
                        ))}
                      </Select>
                    </Item>
                  </div>
                  <Collapse defaultActiveKey={['1']} style={{ width: '90%' }}>
                    <Panel header="Actualizar créditos" key="1">
                      <Form>
                        <Input
                          name="creditos"
                          placeholder="Créditos"
                          label="Créditos"
                          required
                          validations="isNumeric"
                          validationError="Los créditos es un número positivo"
                          defaultValue={creditos}
                        />
                        <TextArea
                          name="Mótivo"
                          label="Mótivo"
                          placeholder="Ingresa el mótivo del ajuste"
                        />
                      </Form>
                    </Panel>
                    <Panel header="Actualizar créditos" key="2">
                      <Form>
                        <Datepicker
                          name="ilimitado"
                          placeholder="Paquete ilímitado"
                          label="Páquete ilímitado"
                          required
                          defaultValue={moment(user.ilimitado.fin)}
                        />
                        <TextArea
                          name="Mótivo"
                          label="Mótivo"
                          placeholder="Ingresa el mótivo del ajuste"
                        />
                      </Form>
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Clases" key="2">
              <Table title="Clase(s)" data={clases} cols={this.clasesCol()} />
            </TabPane>
            <TabPane tab="Calendario" key="3">
              <Clases />
            </TabPane>
            <TabPane tab="Logs" key="4">
              <Table
                title="Log(s)"
                data={[
                  {
                    type: '+3 Créditos',
                    date: moment().format(),
                    user: 'Admin'
                  },
                  {
                    type: '+3 días',
                    date: moment().format(),
                    user: 'Admin'
                  },
                  {
                    type: 'Clase reservada',
                    date: moment().format(),
                    user: 'Usuario'
                  },
                  {
                    type: 'Clase reservada',
                    date: moment().format(),
                    user: 'Admin'
                  }
                ]}
                cols={this.logsCol()}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

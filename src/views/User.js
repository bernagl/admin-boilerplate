import React from 'react'
import Tabs from 'antd/lib/tabs'
// import Datepicker from 'antd/lib/date-picker'
import Table from '../components/EraserTable'
import { Popconfirm, Collapse, Popover, Tag } from 'antd'
import moment from 'moment'
import Clases from '../views/Clases'
import Form from '../Form/Form'
import Input from '../Form/Input'
import TextArea from '../Form/Textarea'
import Datepicker from '../Form/Datepicker'
import {
  getDocument,
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import {
  updateUserCreditos,
  updateUserIlimitado
} from '../actions/user_actions'
import Select from 'antd/lib/select'
import AntdForm from 'antd/lib/form'

const { Option } = Select
const { Item } = AntdForm

const { TabPane } = Tabs
const { Panel } = Collapse

export default class extends React.Component {
  state = {
    clases: [],
    user: null,
    sucursales: [],
    activeSucursal: 0,
    activeSucursalId: null
  }

  async componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const { id } = this.props.match.params
    const sucursales = await getDocumentsByModel('sucursal')
    const user = await this.getUser(id)
    const clasesPromise =
      typeof user.clases === 'undefined'
        ? []
        : Object.keys(user.clases).map(id => getDocument('horario')(id))
    const logsPromise =
      typeof user.logs === 'undefined'
        ? []
        : Object.keys(user.logs).map(id => getDocument('log')(id))
    const clasesResolve = await Promise.all(clasesPromise)
    const logsResolve = await Promise.all(logsPromise)
    const clases = this.orderByDate('inicio')(clasesResolve)
    const logs = this.orderByDate('fecha')(logsResolve)
    this.setState({
      clases,
      user,
      logs,
      sucursales,
      activeSucursalId: sucursales[0].id
    })
  }

  getUser = async id => await getDocument('usuario')(id)

  updateCreditosSubmit = async model => {
    const {
      user: { creditos, logs },
      activeSucursalId,
      activeSucursal,
      sucursales,
      user
    } = this.state
    const { id } = this.props.match.params

    const userResponse = await updateUserCreditos({
      ...model,
      uid: id,
      fecha: moment().format(),
      sucursalId: activeSucursalId,
      sucursalName: sucursales[activeSucursal].nombre,
      lastCreditos: user.creditos[activeSucursalId]
    })
    if (userResponse !== 404) {
      const doc = {
        id,
        creditos: { ...creditos, [activeSucursalId]: model.creditos },
        logs: { ...logs, [userResponse]: true }
      }
      const response = await updateDocument('usuario')(doc)
      this.getData()
    }
  }

  updateSubmit = async ({ motivo, fechaFin }) => {
    const {
      sucursales,
      activeSucursal,
      user: { ilimitado, logs }
    } = this.state
    const { id } = this.props.match.params

    const userResponse = await updateUserIlimitado({
      motivo,
      uid: id,
      fecha: moment().format(),
      nuevaFecha: moment(fechaFin).format('LL'),
      lastFecha: moment(ilimitado.fin).format('LL'),
      sucursalName: sucursales[activeSucursal].nombre
    })

    console.log(userResponse)

    if (userResponse !== 404) {
      const doc = {
        id,
        logs: { ...logs, [userResponse]: true },
        ilimitado: { ...ilimitado, fin: moment(fechaFin).format() }
      }
      const response = await updateDocument('usuario')(doc)
      this.getData()
    }

    this.getData()
  }

  orderByDate = key => arr =>
    arr.sort(
      (a, b) =>
        moment(a[key]) >= moment(b[key])
          ? -1
          : moment(a[key]) <= moment(b[key])
            ? 1
            : 0
    )

  logsCol = () => [
    { label: 'Log', key: 'log' },
    { label: 'Mótivo', key: 'motivo' },
    { label: 'Fecha', Render: ({ fecha }) => moment(fecha).format('LLL') }
    // { label: 'Usuario', key: 'user' }
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
    const { logs, clases, user, sucursales, activeSucursal } = this.state
    const hasUnlimited = user ? (user.ilimitado ? true : false) : false
    const suscription = user
      ? user.last_class
        ? moment() > moment(user.last_class).add(3, 'M')
          ? false
          : true
        : false
      : false
    const unlimitedActive = hasUnlimited
      ? moment() > moment(user.ilimitado.fin)
        ? false
        : true
      : false
    const creditos = user ? user.creditos[sucursales[activeSucursal].id] : 0
    return !user ? (
      <span>Cargando</span>
    ) : (
      <div className="row">
        <div className="col-6">
          <h2>{user.nombre}</h2>
          <Tag color={suscription ? 'green' : user.invitado ? 'blue' : 'red'}>
            Suscripción{' '}
            {suscription
              ? 'activa'
              : user.invitado
                ? 'de prueba (1 clase grátis)'
                : 'inactiva'}
          </Tag>
        </div>
        <div className="col-6">
          <h3>
            {unlimitedActive
              ? `Paquete ilímitado vence: ${moment(user.ilimitado.fin).format(
                  'LL'
                )}`
              : `Créditos ${creditos}`}
          </h3>
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
                          this.setState({
                            activeSucursal,
                            activeSucursalId: sucursales[activeSucursal].id
                          })
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
                  <Collapse style={{ width: '90%' }} accordion>
                    <Panel header="Actualizar créditos" key="1">
                      <Form submit={this.updateCreditosSubmit} shouldUpdate>
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
                          name="motivo"
                          label="Mótivo"
                          required
                          placeholder="Ingresa el mótivo del ajuste"
                        />
                      </Form>
                    </Panel>
                    <Panel header="Actualizar fecha" key="2">
                      <Form submit={this.updateSubmit} shouldUpdate>
                        <Datepicker
                          name="fechaFin"
                          placeholder="Paquete ilímitado"
                          label="Páquete ilímitado"
                          required
                          defaultValue={
                            hasUnlimited ? moment(user.ilimitado.fin) : moment()
                          }
                        />
                        <TextArea
                          name="motivo"
                          label="Mótivo"
                          required
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
              <Table title="Log(s)" data={logs} cols={this.logsCol()} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

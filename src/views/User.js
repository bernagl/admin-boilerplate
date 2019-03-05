import React from 'react'
import Tabs from 'antd/lib/tabs'
import Table from '../components/EraserTable'
import { message, Collapse, Tag, Icon } from 'antd'
import moment from 'moment'
import Form from '../Form/Form'
import Input from '../Form/Input'
import TextArea from '../Form/Textarea'
import Datepicker from '../Form/Datepicker'
import UserCalendar from './UserCalendar'
import UserClasesTable from './UsrClasesTable'
import {
  getDocument,
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import {
  updateUserCreditos,
  updateUserIlimitado,
  updateInscripcionLog
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
    const { activeSucursal } = this.state
    const clasesPromise =
      typeof user.clases === 'undefined'
        ? []
        : Object.keys(user.clases).map(async id => {
            const clase = await getDocument('horario')(id)
            const status = clase['status']
              ? clase['status'] === 2
                ? 4
                : user.clases[id]
              : user.clases[id]
            return { ...clase, status }
          })
    const logsPromise =
      typeof user.logs === 'undefined'
        ? []
        : Object.keys(user.logs).map(id => getDocument('log')(id))
    const logsResolve = await Promise.all(logsPromise)
    const logs = this.orderByDate('fecha')(logsResolve)
    const clasesResolve = await Promise.all(clasesPromise)
    const clases = this.orderByDate('inicio')(clasesResolve)
    this.setState({
      clases,
      user,
      logs,
      sucursales,
      activeSucursalId: sucursales[activeSucursal].id
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
        ? user.creditos[activeSucursalId]
        : 0
    })
    if (userResponse !== 404) {
      const doc = {
        id,
        creditos: { ...creditos, [activeSucursalId]: +model.creditos },
        logs: { ...logs, [userResponse]: true }
      }
      const response = await updateDocument('usuario')(doc)

      response === 202
        ? message.success('Créditos actualizados')
        : message.error('Ocurrió un error, por favor vuelve a intentarlo')
      this.getData()
    }
  }

  updateSubmit = async ({ motivo, fechaFin, sid }) => {
    const {
      sucursales,
      activeSucursal,
      user: { ilimitado = {}, logs }
    } = this.state
    const { id } = this.props.match.params

    const userResponse = await updateUserIlimitado({
      motivo,
      uid: id,
      fecha: moment().format(),
      nuevaFecha: moment(fechaFin).format('LL'),
      lastFecha: ilimitado[sid]
        ? moment(ilimitado[sid].fin).format('LL')
        : moment().format('LL'),
      sucursalName: sucursales[activeSucursal].nombre
    })

    if (userResponse !== 404) {
      const doc = {
        id,
        logs: { ...logs, [userResponse]: true },
        ilimitado: {
          ...ilimitado,
          [sid]: { fin: moment(fechaFin).format() }
        }
      }
      const response = await updateDocument('usuario')(doc)
      response === 202
        ? message.success('Fecha ilímitada actualizada')
        : message.error('Ocurrió un error, por favor vuelve a intentarlo')
      this.getData()
    }
  }

  updateExpiredCredit = async ({ motivo, fechaFin }) => {
    const {
      sucursales,
      activeSucursal,
      user: { expires, logs }
    } = this.state
    const { id } = this.props.match.params

    const userResponse = await updateUserIlimitado({
      motivo,
      uid: id,
      fecha: moment().format(),
      nuevaFecha: moment(fechaFin).format('LL'),
      lastFecha: expires ? moment(expires).format('LL') : moment().format('LL'),
      sucursalName: sucursales[activeSucursal].nombre
    })

    if (userResponse !== 404) {
      const doc = {
        id,
        logs: { ...logs, [userResponse]: true },
        expires: moment(fechaFin).format()
      }
      const response = await updateDocument('usuario')(doc)
      response === 202
        ? message.success('Fecha de expiración de créditos actualizada')
        : message.error('Ocurrió un error, por favor vuelve a intentarlo')
      this.getData()
    }
  }

  agregarInscripcion = async ({ motivo }) => {
    const {
      user: { id, logs }
    } = this.state

    const userResponse = await updateInscripcionLog({
      motivo,
      uid: id,
      fecha: moment().format()
    })

    if (userResponse !== 404) {
      const doc = {
        id,
        logs: { ...logs, [userResponse]: true },
        last_class: moment().format(),
        status: 1
      }

      const response = await updateDocument('usuario')(doc)
      response === 202
        ? message.success('Inscripción actualizada')
        : message.error('Ocurrió un error, por favor vuelve a intentarlo')
      this.getData()
    }
  }

  orderByDate = key => arr =>
    arr.sort((a, b) =>
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
  ]

  render() {
    const {
      logs,
      clases,
      user,
      sucursales,
      activeSucursal,
      activeSucursalId
    } = this.state
    const { id } = this.props.match.params
    const expires = user
      ? typeof user['expires'] !== 'undefined'
        ? moment(user.expires)
        : moment()
      : moment()

    const suscription = user
      ? user.status === 1
        ? user.last_class
          ? moment() > moment(user.last_class).add(3, 'M')
            ? false
            : true
          : false
        : false
      : false

    const rioja = user
      ? typeof user.ilimitado !== 'undefined'
        ? user.ilimitado['-LJ5w7hFuZxYmwiprTIY']
        : null
      : null
    const valle = user
      ? typeof user.ilimitado !== 'undefined'
        ? user.ilimitado['-LPrNpstwZt7J3NLUJXc']
        : null
      : null

    const riojaCredits = user ? user.creditos['-LJ5w7hFuZxYmwiprTIY'] : 0
    const valleCredits = user ? user.creditos['-LPrNpstwZt7J3NLUJXc'] : 0

    const selectedUnlimited = user
      ? user.ilimitado
        ? user.ilimitado[activeSucursalId]
          ? user.ilimitado[activeSucursalId].fin
          : null
        : null
      : null

    const riojaUnlimited =
      rioja && moment(rioja.fin) > moment()
        ? moment(rioja.fin).format('LL')
        : null

    const valleUnlimited =
      valle && moment(valle.fin) > moment()
        ? moment(valle.fin).format('LL')
        : null

    const creditos = user
      ? user.creditos[activeSucursalId]
        ? user.creditos[activeSucursalId]
        : 0
      : 0

    return !user ? (
      <span>Cargando</span>
    ) : (
      <div className="row">
        <div className="col-6">
          <h2 className="mb-1">{user.nombre}</h2>
          {typeof user.fecha_nacimiento !== 'undefined' && (
            <h3>
              {' '}
              <Icon type="gift" /> {moment(user.fecha_nacimiento).format('LL')}
            </h3>
          )}
          <div>{user.correo}</div>
          <div className="mb-2">{user.telefono}</div>
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
            {[
              <div>
                La rioja:{' '}
                {riojaUnlimited ? (
                  <span>{riojaUnlimited} (paquete ilímitado)</span>
                ) : (
                  <span>{riojaCredits || 0} créditos</span>
                )}
              </div>,
              <div>
                Valle:{' '}
                {valleUnlimited ? (
                  <span>{valleUnlimited} (paquete ilímitado)</span>
                ) : (
                  <span>{valleCredits || 0} créditos</span>
                )}
              </div>
            ]}
          </h3>
        </div>
        <div className="col-12">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Perfil" key="1">
              <div className="row">
                <div className="col-6">
                  <div>
                    <Item label="Sucursal">
                      <Select
                        name="sucursal"
                        onChange={activeSucursal => {
                          this.setState({
                            activeSucursal,
                            activeSucursalId: sucursales[activeSucursal].id
                          })
                        }}
                        style={{ width: 200 }}
                        defaultValue={sucursales[activeSucursal].nombre}
                      >
                        {sucursales.map((sucursal, i) => (
                          <Option key={i}>{sucursal.nombre}</Option>
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
                          defaultValue={creditos || 0}
                        />
                        <TextArea
                          name="motivo"
                          label="Mótivo"
                          required
                          placeholder="Ingresa el mótivo del ajuste"
                        />
                      </Form>
                    </Panel>
                    <Panel
                      header="Actualizar fecha de expiración (créditos)"
                      key="2"
                    >
                      <Form submit={this.updateExpiredCredit} shouldUpdate>
                        <Datepicker
                          name="fechaFin"
                          placeholder="Paquete ilímitado"
                          label="Páquete ilímitado"
                          required
                          defaultValue={expires}
                        />
                        <TextArea
                          name="motivo"
                          label="Mótivo"
                          required
                          placeholder="Ingresa el mótivo del ajuste"
                        />
                      </Form>
                    </Panel>
                    <Panel
                      header="Actualizar fecha (paquete ilímitado)"
                      key="3"
                    >
                      <Form submit={this.updateSubmit} shouldUpdate>
                        <Datepicker
                          name="fechaFin"
                          placeholder="Paquete ilímitado"
                          label="Páquete ilímitado"
                          required
                          defaultValue={
                            // hasUnlimited ? moment(user.ilimitado.fin) : moment()
                            selectedUnlimited
                              ? moment(selectedUnlimited)
                              : moment()
                            // typeof user.ilimitado[activeSucursalId]['fin'] ===
                            // 'undefined'
                            //   ? moment()
                            //   : moment(user.ilimitado[activeSucursalId].fin)
                          }
                        />
                        <TextArea
                          name="motivo"
                          label="Mótivo"
                          required
                          placeholder="Ingresa el mótivo del ajuste"
                        />
                        <Input
                          type="hidden"
                          name="sid"
                          required
                          defaultValue={activeSucursalId}
                        />
                      </Form>
                    </Panel>
                    <Panel header="Asignar inscripción " key="4">
                      <Form submit={this.agregarInscripcion} shouldUpdate>
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
              <UserClasesTable
                clases={clases}
                uid={id}
                updateData={this.getData}
              />
            </TabPane>
            <TabPane tab="Calendario" key="3">
              <UserCalendar
                userClases={user.clases}
                creditos={user.creditos}
                ilimitado={user.ilimitado}
                expires={expires.format()}
                updateData={this.getData}
                uid={id}
              />
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

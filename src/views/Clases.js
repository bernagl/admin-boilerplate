import React, { Component } from 'react'
import AnimationWrapper from '../components/AnimationWrapper'
import { Button, Icon, Input, message, Modal, Radio, Tabs } from 'antd'
import moment from 'moment'
import 'moment/locale/es'
import { Body, Header } from '../components/Calendario'
import {
  getDocumentsByModel,
  getCollectionLength
} from '../actions/firebase_actions'
import {
  cancelarClase,
  getUsuarios,
  getGanancias
} from '../actions/clase_actions'
import EditarClase from '../components/EditarClase'
import '../assets/calendar.css'
import { sendMail } from '../actions/mail_actions'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const { TabPane } = Tabs
moment.locale('es')
// moment.tz.setDefault('America/Mexico_City')
message.config({
  duration: 2,
  maxCount: 3
})

export default class Gimnasio extends Component {
  state = {
    cancelClass: true,
    gymSelected: 0,
    gimnasios: [],
    clasesCount: 0,
    week: 0,
    event: null,
    events: [],
    creditos: 5,
    menosCreditos: 0,
    motivo: null,
    modal: false,
    clases: new Map(),
    month: moment().format('MMMM'),
    dates: [],
    ganancia: 0,
    totalUsuarios: 0,
    totalPagos: 0,
    totalClases: 0,
    dias: [
      { name: 'Lunes', events: [] },
      { name: 'Martes', events: [] },
      { name: 'Miércoles', events: [] },
      { name: 'Jueves', events: [] },
      { name: 'Viernes', events: [] },
      { name: 'Sábado', events: [] },
      { name: 'Domingo', events: [] }
    ]
  }

  async componentDidMount() {
    const gimnasios = await getDocumentsByModel('sucursal')
    const clases = await getDocumentsByModel('horario')
    const totalUsuarios = await getCollectionLength('usuario')
    const totalClases = await getCollectionLength('horario')
    const totalPagos = await getCollectionLength('pago')
    const ganancia = await getGanancias()
    const clasesOrdered = clases.sort((a, b) =>
      moment(a.inicio) > moment(b.inicio)
        ? 1
        : moment(a.inicio) < moment(b.inicio)
        ? -1
        : 0
    )
    this.setState(
      {
        events: clasesOrdered,
        gimnasios,
        ganancia,
        totalUsuarios,
        totalPagos,
        totalClases
      },
      () => this.handleGym(0)
    )
  }

  handleGym = i => {
    this.setState({ gymSelected: i }, () => this.daysHandler())
  }

  daysHandler = sum => {
    const { gimnasios, gymSelected, events, dias, week } = this.state
    const weekNumber = sum
      ? week + 1
      : sum === 0
      ? week - 1
      : week === 0
      ? 0
      : week - 1
    var startOfWeek = moment()
      .add(weekNumber, 'weeks')
      .startOf('isoWeek')
    var endOfWeek = moment()
      .add(weekNumber, 'weeks')
      .endOf('isoWeek')

    var days = []
    var day = startOfWeek

    while (day <= endOfWeek) {
      days.push(day.toDate())
      day = day.clone().add(1, 'd')
    }
    let d = [...dias]
    let id_gym = gimnasios[gymSelected].id
    days.map((day, i) => {
      const evts = events.filter(
        (e, j) =>
          (moment(day).format() === e.fecha && e.gimnasio.id === id_gym) ||
          (moment(day).format('L') === e.fecha && e.gimnasio.id === id_gym)
      )
      return (d[i] = { events: evts, name: d[i].name })
    })

    const month = moment(startOfWeek).format('MMMM')
    this.setState({
      week: weekNumber,
      dates: days,
      dias: d,
      month
    })
  }

  cancelarClase = async () => {
    const { event, motivo, cancelClass, usuarios } = this.state
    if (!cancelClass) {
      message.error(
        'Las clases solo se pueden cancelar 3 horas antes de su inicio'
      )
      return
    }
    if (!motivo) {
      message.error(
        'Debes de ingresar un motivo para poder notificarle a los usuarios'
      )
      return
    }
    const response = await cancelarClase({ clase: event, motivo, usuarios })
    if (response === 202) {
      message.success(
        'La clase se ha cancelado y los usuarios han sido notificados'
      )
      // sendMail(usuarios, motivo)
      sendMail(
        usuarios,
        {
          instructora: event.instructor.nombre,
          inicio: moment(event.inicio).format('LLLL')
        },
        motivo
      )
      const clases = await getDocumentsByModel('horario')
      this.setState({ clases, events: clases, modal: false }, () =>
        this.daysHandler()
      )
    } else {
      message.error('Ocurrió un error, por favor intentalo de nuevo')
    }
  }

  updatedClass = async () => {
    const clases = await getDocumentsByModel('horario')
    this.setState({ clases, events: clases, modal: false }, () =>
      this.daysHandler()
    )
  }

  cancel = () => {
    this.setState({ modal: false, usuarios: [] })
  }

  eventHandler = async (event, cola) => {
    const difference = moment.duration(moment(event.inicio).diff(moment()))
    const cancelClass = difference.asHours() > 3 ? true : false
    const usuarios = await getUsuarios(event.id)
    this.setState({ modal: true, event, cancelClass, usuarios })
    // sendMail()
  }

  render() {
    const {
      cancelClass,
      event,
      dates,
      dias,
      clases,
      modal,
      gymSelected,
      gimnasios,
      usuarios
    } = this.state
    return (
      <AnimationWrapper>
        <div className="col-12 my-4">
          <div className="row">
            <div className="col-12 container-shadow p-2 p-md-4">
              <div className="row">
                <div className="col-12 center-text my-4 my-md-0">
                  <RadioGroup defaultValue={gymSelected} size="large">
                    {gimnasios.map(
                      (gym, i) =>
                        gym.status === 1 && (
                          <RadioButton
                            value={gym.id}
                            onClick={() => this.handleGym(i)}
                            key={i}
                          >
                            {gym.nombre}
                          </RadioButton>
                        )
                    )}
                  </RadioGroup>
                </div>
                <div className="col-12">
                  <div className="calendar-container">
                    <Button
                      type="primary"
                      onClick={() => this.daysHandler(0)}
                      className="box-button"
                    >
                      <Icon type="left" />
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => this.daysHandler(1)}
                      className="box-button"
                    >
                      <Icon type="right" />
                    </Button>
                    <Header dates={dates} dias={dias} />
                    <Body
                      clases={clases}
                      dates={dates}
                      dias={dias}
                      eventHandler={this.eventHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {event && (
          <Modal
            title="Detalle de la clase"
            visible={modal}
            onCancel={this.cancel}
            onOk={this.cancel}
            // onOk={this.cancelarClase}
            cancelText=""
            okText="Cerrar"
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Usuarios inscritos" key="1">
                {usuarios.length > 0 ? (
                  usuarios.map(({ id, nombre }) => <div key={id}>{nombre}</div>)
                ) : (
                  <div>No hay usuarios inscritos</div>
                )}
              </TabPane>
              <TabPane tab="Editar clase" key="2">
                <EditarClase event={event} updatedClass={this.updatedClass} />
              </TabPane>
              <TabPane tab="Cancelar clase" key="3">
                <div className="row">
                  <div className="col-12">
                    <span>Clase: {event.clase.nombre}</span>
                  </div>
                  <div className="col-12">
                    <span>Fecha: {event.fecha}</span>
                  </div>
                  <div className="col-12">
                    <span>Instructor: {event.instructor.nombre}</span>
                  </div>
                  <div className="col-12">
                    <span>
                      De: {moment(event.inicio).format('LT')} a{' '}
                      {moment(event.fin).format('LT')}
                    </span>
                  </div>
                  <div className="col-12 mt-3">
                    {cancelClass ? (
                      <Input.TextArea
                        placeholder="Motivo de cancelamiento"
                        onChange={({ target: { value } }) =>
                          this.setState({ motivo: value })
                        }
                      />
                    ) : (
                      <span>
                        Las clases solo se pueden cancelar 3 horas antes de su
                        inicio
                      </span>
                    )}
                  </div>
                  <div className="col-12 mt-2">
                    <Button type="primary" onClick={this.cancelarClase}>
                      Cancelar clase
                    </Button>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Modal>
        )}
      </AnimationWrapper>
    )
  }
}

import React, { Component } from 'react'
import AnimationWrapper from '../components/AnimationWrapper'
import { Button, Card, Icon, Input, message, Modal, Radio } from 'antd'
import moment from 'moment'
import 'moment/locale/es'
import { Body, Header } from '../components/Calendario'
import { getDocumentsByModel } from '../actions/firebase_actions'
import { cancelarClase } from '../actions/clase_actions'
import '../assets/calendar.css'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
moment.locale('es')
// moment.tz.setDefault('America/Mexico_City')
message.config({
  duration: 2,
  maxCount: 3
})

export default class Gimnasio extends Component {
  state = {
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
    const clasesOrdered = clases.sort(
      (a, b) =>
        moment(a.inicio) > moment(b.inicio)
          ? 1
          : moment(a.inicio) < moment(b.inicio)
            ? -1
            : 0
    )
    this.setState(
      {
        events: clasesOrdered,
        gimnasios
      },
      () => this.handleGym(0)
    )
  }

  handleGym = i => {
    this.setState({ gymSelected: i }, () => this.daysHandler())
  }

  daysHandler = sum => {
    const { gimnasios, gymSelected, events, dias, week } = this.state
    const weekNumber = sum ? week + 1 : week === 0 ? 0 : week - 1
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
          moment(day).format('L') === e.fecha && e.gimnasio.id === id_gym
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
    const { event, motivo } = this.state
    if (!motivo) {
      message.error(
        'Debes de ingresar un motivo para poder notificarle a los usuarios'
      )
      return
    }
    const response = await cancelarClase({ clase: event, motivo })
    if (response === 202) {
      message.success(
        'La clase se ha cancelado y los usuarios han sido notificados'
      )
      const clases = await getDocumentsByModel('horario')
      this.setState({ clases, events: clases, modal: false }, () =>
        this.daysHandler()
      )
    } else {
      message.error('Ocurrió un error, por favor intentalo de nuevo')
    }
  }
  cancel = () => {
    this.setState({ modal: false })
  }

  eventHandler = (event, cola) => {
    this.setState({ modal: true, event })
  }

  render() {
    const {
      event,
      dates,
      dias,
      clases,
      modal,
      gymSelected,
      gimnasios
    } = this.state
    // const { auth } = this.props
    return (
      <AnimationWrapper>
        {/* <div className="row align-items-center"> */}
        <div className="col-12 my-4">
          <div className="row">
            <div className="col-12 mb-5">
              <div className="row">
                <div className="col-4">
                  <Card title="Pagos">
                    <p>Ganancia total: $5000 MXN</p>
                    <p>Total pagos: 50</p>
                  </Card>
                </div>
                <div className="col-4">
                  <Card title="Usuarios">
                    <p>Total: 500</p>
                    <p>Activos: 150</p>
                  </Card>
                </div>
                <div className="col-4">
                  <Card title="Clases">
                    <p>Clases este mes: 70</p>
                    <p>Mes pasado: 55</p>
                  </Card>
                </div>
              </div>
            </div>
            <div className="col-12 container-shadow p-2 p-md-4">
              <div className="row">
                <div className="col-12 center-text my-4 my-md-0">
                  <RadioGroup defaultValue={gymSelected} size="large">
                    {gimnasios.map((gym, i) => (
                      <RadioButton
                        value={gym.id}
                        onClick={() => this.handleGym(i)}
                        key={i}
                      >
                        {gym.nombre}
                      </RadioButton>
                    ))}
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
            onOk={this.cancelarClase}
            cancelText="Regresar"
            okText="Cancelar clase"
          >
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
                <Input.TextArea
                  placeholder="Motivo de cancelamiento"
                  onChange={motivo => this.setState({ motivo })}
                />
              </div>
            </div>
          </Modal>
        )}
        {/* </div> */}
      </AnimationWrapper>
    )
  }
}

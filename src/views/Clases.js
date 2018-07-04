import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AnimationWrapper from '../components/AnimationWrapper'
import { Button, Icon, message, Radio } from 'antd'
// import moment from 'moment-timezone'
import moment from 'moment'
import 'moment/locale/es'
import { Body, Header } from '../components/Calendario'
import { getDocumentsByModel } from '../actions/firebase_actions'
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
    events: [],
    creditos: 5,
    menosCreditos: 0,
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
    console.log(clases)
    this.setState(
      {
        events: clases,
        gimnasios
      },
      () => this.handleGym(0)
    )
  }

  handleGym = i => {
    const { gimnasios } = this.state
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
      const evts = events.filter((e, j) => {
        // console.log(
        //   e.fecha,
        //   moment(day).format('L'),
        //   e.fecha
        // )
        return moment(day).format('L') === e.fecha && e.gimnasio.id === id_gym
      })
      d[i] = { events: evts, name: d[i].name }
    })

    const month = moment(startOfWeek).format('MMMM')
    this.setState({
      week: weekNumber,
      dates: days,
      dias: d,
      month
    })
  }

  eventHandler = (event, cola) => {
    console.log(event, cola)
  }

  setCheckout = () => {
    const { clases, creditos } = this.state
    clases.size === 0
      ? message.error('Para proceder al pago debes agregar al menos una clase')
      : (this.props.setCheckout({ clases, creditos }),
        this.props.history.push('/checkout'))
  }

  render() {
    const {
      dates,
      clasesCount,
      creditos,
      dias,
      clases,
      gymSelected,
      gimnasios,
      menosCreditos
    } = this.state
    // const { auth } = this.props
    return (
      <AnimationWrapper>
        {/* <div className="row align-items-center"> */}
        <div className="col-12 my-4">
          <div className="row">
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
        {/* </div> */}
      </AnimationWrapper>
    )
  }
}

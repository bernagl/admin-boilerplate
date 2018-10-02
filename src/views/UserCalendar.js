import React, { Component } from 'react'
import WeekCalendar from 'react-week-events'
import 'react-week-events/dist/styles.css'
import { getDocumentsByModel } from '../actions/firebase_actions'
import moment from 'moment'
import message from 'antd/lib/message'
import '../userCalendar.css'

export default class extends Component {
  state = { userClases: [], clases: [], creditos: {}, cart: {} }
  async componentDidMount() {
    const { userClases, creditos } = this.props
    const clases = await getDocumentsByModel('horario')
    this.setState({ clases, userClases, creditos })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userClases === this.props.userClases) return
    this.setState({ userClases: this.props.userClases })
  }

  eventRender = event => {
    const { id, inicio, fin, instructor, clase } = event
    const { userClases, cart } = this.state
    const isReserved = Object.keys(userClases).find(cid => cid === id)
    const status = userClases[isReserved] === 1 ? 1 : 0
    const itsOnCart = typeof cart[event.id] === 'undefined' ? false : true
    return (
      <div
        className={`class-container status-${
          isReserved ? status : itsOnCart ? 1 : 0
        }`}
        onClick={() =>
          status !== 1
            ? this.eventHandler(event)
            : message.info('Para cancelar la clase es en el apartado de clases')
        }
      >
        <div className="">{clase.nombre}</div>
        <div className="">{instructor.nombre}</div>
        <div className="">
          {moment(inicio).format('LT')} - {moment(fin).format('LT')}
        </div>
      </div>
    )
  }

  eventHandler = clase => {
    const { cart: stateCart, creditos: stateCreditos } = this.state
    const itsOnCart = typeof stateCart[clase.id] === 'undefined' ? false : true
    if (stateCreditos['-LJ5w7hFuZxYmwiprTIY'] === 0 && !itsOnCart) {
      message.error('No tienes créditos')
      return
    }
    let cart = stateCart
    let creditos = stateCreditos
    itsOnCart
      ? (delete cart[clase.id],
        message.info('Clase devuelta'),
        (creditos = {
          ...creditos,
          ['-LJ5w7hFuZxYmwiprTIY']: +creditos['-LJ5w7hFuZxYmwiprTIY'] + 1
        }))
      : ((cart = { ...stateCart, [clase.id]: clase }),
        message.success('Clase agregada'),
        (creditos = {
          ...creditos,
          ['-LJ5w7hFuZxYmwiprTIY']: +creditos['-LJ5w7hFuZxYmwiprTIY'] - 1
        }))

    this.setState({ creditos, cart })
  }

  render() {
    const { clases, creditos } = this.state
    console.log(creditos)
    return (
      <WeekCalendar
        events={clases}
        emptyRender={() => 'No clases'}
        eventRender={this.eventRender}
        past={true}
        dateLabel="inicio"
      />
    )
  }
}

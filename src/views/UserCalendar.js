import React, { Component } from 'react'
import WeekCalendar from 'react-week-events'
import 'react-week-events/dist/styles.css'
import { getDocumentsByModel } from '../actions/firebase_actions'
import moment from 'moment'
import message from 'antd/lib/message'
import Button from 'antd/lib/button'
import '../userCalendar.css'
import { confirmCheckout } from '../actions/user_actions'

export default class extends Component {
  state = {
    userClases: [],
    clases: [],
    creditos: {},
    cart: {},
    ilimitado: null
  }
  async componentDidMount() {
    const { userClases, creditos, ilimitado } = this.props
    const clases = await getDocumentsByModel('horario')

    this.setState({
      clases,
      userClases: userClases ? userClases : {},
      creditos,
      ilimitado,
      loading: false
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.userClases === this.props.userClases &&
      prevProps.creditos === this.props.creditos
    )
      return
    this.setState({
      userClases: this.props.userClases,
      creditos: this.props.creditos
    })
  }

  eventRender = event => {
    const { id, inicio, fin, instructor, clase } = event
    const { userClases, cart } = this.state
    const isReserved = Object.keys(userClases).find(
      cid => cid === id && userClases[cid] !== 2
    )

    const status =
      userClases[isReserved] === 0
        ? 1
        : userClases[isReserved]
          ? userClases[isReserved]
          : 0
    const itsOnCart = typeof cart[event.id] === 'undefined' ? false : true
    return (
      <div
        className={`class-container status-${
          isReserved ? status : itsOnCart ? 1 : 0
        }`}
        onClick={() => {
          console.log(status)
          status === 0
            ? this.eventHandler(event)
            : status === 1
              ? message.info(
                  'Para cancelar la clase es en el apartado de clases'
                )
              : message.info('La clase ya se venció')
        }}
      >
        <div className="">
          {clase.nombre} - {status}
        </div>
        <div className="">{instructor.nombre}</div>
        <div className="">
          {moment(inicio).format('LT')} - {moment(fin).format('LT')}
        </div>
      </div>
    )
  }

  eventHandler = clase => {
    const { cart: stateCart, creditos: stateCreditos, ilimitado } = this.state
    const itsOnCart = typeof stateCart[clase.id] === 'undefined' ? false : true
    if (
      stateCreditos['-LJ5w7hFuZxYmwiprTIY'] === 0 &&
      !itsOnCart &&
      !ilimitado
    ) {
      message.error('No tienes créditos')
      return
    }
    if (ilimitado) {
      if (moment(clase.inicio) > moment(ilimitado.fin)) {
        message.info('Tu paquete ilímitado no alcanza la fecha seleccionada')
        return
      }
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

  submit = async () => {
    const { cart, ilimitado: isIlimitado } = this.state
    const { uid, updateData } = this.props
    const clases = Object.keys(cart).map(id => cart[id])
    this.setState({ loading: true })
    message.info('Inscribiendo al usuario en la(s) clase(s)')
    const response = await confirmCheckout({ clases, isIlimitado, uid })
    message.success('El usuario fue inscrito en la(s) clase(s)')
    updateData()
    this.setState({ loading: false, cart: {} })
  }

  render() {
    const { clases, creditos, cart, ilimitado, loading } = this.state
    const cartLength = Object.keys(cart).length
    return (
      <div className="row">
        <div className="col-12">
          <h2>Calendario</h2>
          {ilimitado ? (
            <h4>Paquete ilímitado</h4>
          ) : (
            <h4>Créditos disponibles: {creditos['-LJ5w7hFuZxYmwiprTIY']}</h4>
          )}
          <h4>Clases seleccionadas: {cartLength}</h4>
          <Button
            onClick={this.submit}
            type="primary"
            disabled={cartLength > 0 ? false : true}
            className="btn-reservar"
            loading={loading}
          >
            Reservar clases
          </Button>
        </div>
        <div className="col-12">
          <WeekCalendar
            events={clases}
            emptyRender={() => 'No clases'}
            eventRender={this.eventRender}
            past={true}
            dateLabel="inicio"
          />
        </div>
      </div>
    )
  }
}

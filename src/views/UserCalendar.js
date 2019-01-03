import React, { Component } from 'react'
import WeekCalendar from 'react-week-events'
import 'react-week-events/dist/styles.css'
import { getDocumentsByModel } from '../actions/firebase_actions'
import moment from 'moment'
import message from 'antd/lib/message'
import Button from 'antd/lib/button'
import { Radio } from 'antd'
import '../userCalendar.css'
import { confirmCheckout } from '../actions/user_actions'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

export default class extends Component {
  state = {
    userClases: {},
    sucursales: [],
    clases: [],
    creditos: {},
    cart: {},
    // ilimitado: null,
    gymSelected: '-LJ5w7hFuZxYmwiprTIY'
  }

  async componentDidMount() {
    const { userClases, creditos } = this.props
    const clases = await getDocumentsByModel('horario')
    const sucursales = await getDocumentsByModel('sucursal')
    clases.sort((a, b) => moment(a.inicio) - moment(b.inicio))
    this.setState({
      clases,
      userClases: userClases ? userClases : {},
      creditos,
      // ilimitado,
      loading: false,
      sucursales
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.userClases === this.props.userClases &&
      prevProps.creditos === this.props.creditos
    )
      return
    this.setState({
      userClases: this.props.userClases ? this.props.userClases : {},
      creditos: this.props.creditos
    })
  }

  handleGym = gymSelected => {
    this.setState({ gymSelected })
  }

  eventRender = event => {
    const { id, inicio, fin, instructor, clase, status: s } = event
    if (s === 2) return
    const { gymSelected, userClases, cart } = this.state
    if (event.gimnasio.id !== gymSelected) return false
    const isReserved = Object.keys(userClases).find(
      cid => cid === id && userClases[cid] !== 2
    )

    const status =
      userClases[isReserved] === 0 ? 2 : userClases[isReserved] === 1 ? 2 : 0
    const itsOnCart = typeof cart[event.id] === 'undefined' ? false : true
    return (
      <div
        className={`class-container status-${
          isReserved ? status : itsOnCart ? 1 : 0
        }`}
        onClick={() => {
          status === 0
            ? this.eventHandler(event)
            : status === 2
            ? moment(event.inicio) > moment()
              ? message.info(
                  'Para cancelar la clase es en el apartado de clases'
                )
              : message.info('La clase ya concluyó y no se puede cancelar')
            : message.info('La clase ya se venció')
        }}
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
    const {
      gymSelected,
      cart: stateCart,
      creditos: stateCreditos
      // ilimitado
    } = this.state
    const { expires, ilimitado } = this.props

    if (moment(clase.inicio) < moment()) {
      message.info('Esta clase ya concluyó')
      return
    }
    const itsOnCart = typeof stateCart[clase.id] === 'undefined' ? false : true
    const sucursalCredits =
      typeof stateCreditos[gymSelected] === 'undefined'
        ? 0
        : stateCreditos[gymSelected]
    if (sucursalCredits === 0 && !itsOnCart && !ilimitado) {
      message.error('No tienes créditos')
      return
    }
    if (ilimitado) {
      if (moment(clase.inicio) > moment(ilimitado.fin).add(1, 'day')) {
        message.info('Tu paquete ilímitado no alcanza la fecha seleccionada')
        return
      }
    } else {
      if (moment(clase.inicio) > moment(expires).add(1, 'day')) {
        message.info('Tus créditos expiran antes de la clase seleccionada')
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
          [gymSelected]: +creditos[gymSelected] + 1
        }))
      : ((cart = { ...stateCart, [clase.id]: clase }),
        message.success('Clase agregada'),
        (creditos = {
          ...creditos,
          [gymSelected]: +creditos[gymSelected] - 1
        }))

    this.setState({ creditos, cart })
  }

  submit = async () => {
    const { cart } = this.state
    const { uid, updateData, ilimitado: isIlimitado } = this.props
    const clases = Object.keys(cart).map(id => cart[id])
    this.setState({ loading: true })
    message.info('Inscribiendo al usuario en la(s) clase(s)')
    const response = await confirmCheckout({ clases, isIlimitado, uid })
    message.success('El usuario fue inscrito en la(s) clase(s)')
    updateData()
    this.setState({ loading: false, cart: {} })
  }

  render() {
    const {
      gymSelected,
      sucursales,
      clases,
      creditos,
      cart,
      // ilimitado,
      loading
    } = this.state
    const { expires, ilimitado } = this.props

    const cartLength = Object.keys(cart).length
    const sucursalCredits =
      typeof creditos[gymSelected] === 'undefined' ? 0 : creditos[gymSelected]
    return (
      <div className="row">
        <div className="col-12">
          <h2>Calendario</h2>
          {ilimitado ? (
            <h4>Paquete ilímitado</h4>
          ) : (
            [
              <h4 className="mb-0">Créditos disponibles: {sucursalCredits}</h4>,
              <h6>Expiran en: {moment(expires).format('LL')}</h6>
            ]
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
        <div className="col-12 center-text my-4 my-md-0">
          <RadioGroup defaultValue={gymSelected} size="large">
            {sucursales.map(
              (gym, i) =>
                gym.status === 1 && (
                  <RadioButton
                    value={gym.id}
                    onClick={() => this.handleGym(gym.id)}
                    key={i}
                  >
                    {gym.nombre}
                  </RadioButton>
                )
            )}
          </RadioGroup>
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

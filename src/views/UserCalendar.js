import React, { Component } from 'react'
import WeekCalendar from 'react-week-events'
import 'react-week-events/dist/styles.css'
import {
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import moment from 'moment'
import message from 'antd/lib/message'
import Button from 'antd/lib/button'
import { Radio } from 'antd'
import '../userCalendar.css'
import { agregarEnEspera, confirmCheckout } from '../actions/user_actions'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

export default class extends Component {
  state = {
    userClases: {},
    sucursales: [],
    clases: [],
    creditos: {},
    cart: {},
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
    const { creditos } = this.props
    this.setState({ gymSelected, cart: {}, creditos })
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
      userClases[isReserved] === 0
        ? 2
        : userClases[isReserved] === 1
        ? 2
        : userClases[isReserved] === 3
        ? 3
        : 0
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
            ? message.info('Para cancelar la clase es en el apartado de clases')
            : status === 3
            ? this.handleTailClass(event)
            : // : message.info('La clase ya concluyó y no se puede cancelar')
              message.info('La clase ya se venció')
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

  handleTailClass = async event => {
    if (!window.confirm('¿Deseas eliminarte de la lista de espera?')) return
    const { uid: id, updateData } = this.props
    const { userClases } = this.state
    const newUserClases = { ...userClases }
    const newClassTail = { ...(event.espera ? event.espera : {}) }
    delete newClassTail[id]
    delete newUserClases[event.id]
    const updateUserResponse = await updateDocument('usuario')({
      id,
      clases: newUserClases
    })

    if (updateUserResponse === 202) {
      const updateClassResponse = await updateDocument('horario')({
        id: event.id,
        espera: newClassTail
      })
      if (updateClassResponse === 202) {
        message.success('Te hemos eliminado de la lista de espera')
        updateData()
      } else message.error('Ocurrió un error, por favor vuelve a intentarlo')
    } else message.error('Ocurrió un error, por favor vuelve a intentarlo')
  }

  eventHandler = async clase => {
    const { gymSelected, cart: stateCart, creditos: stateCreditos } = this.state
    const { expires, ilimitado } = this.props

    const isUnlimited = this.getStatus()

    if (moment(clase.inicio) < moment()) {
      message.info('Esta clase ya concluyó')
      return
    }
    const itsOnCart = typeof stateCart[clase.id] === 'undefined' ? false : true
    const sucursalCredits =
      typeof stateCreditos[gymSelected] === 'undefined'
        ? 0
        : stateCreditos[gymSelected]
    if (sucursalCredits <= 0 && !itsOnCart && !isUnlimited) {
      message.error('No tienes créditos')
      return
    }

    if (clase.cupo <= clase.inscritos_numero) {
      if (
        !window.confirm(
          '¿Esta clase ya está llena, deseas que te agreguemos a la cola?'
        )
      )
        return
      else {
        const r = await agregarEnEspera({
          uid: this.props.uid,
          cid: clase.id
        })
        if (r === 202) {
          message.success(
            'Fuiste agregado a la lista de espera, si un usuario cancela la clase se te notificará'
          )
          this.setState(
            {
              creditos: stateCreditos,
              userClases: {
                ...this.state.userClases,
                [clase.id]: 3
              }
            },
            () => this.props.updateData()
          )
          return
        } else message.error('Ocurrió un error, por favor vuelve a intentarlo')
        return
      }
    }

    if (isUnlimited) {
      if (
        moment(clase.inicio) > moment(ilimitado[gymSelected].fin).add(1, 'day')
      ) {
        message.info('Tu paquete ilímitado no alcanza la fecha seleccionada')
        return
      }
    } else {
      if (moment(clase.inicio) > moment(expires)) {
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
    const { uid, updateData } = this.props
    const isUnlimited = this.getStatus()
    const clases = Object.keys(cart).map(id => cart[id])
    this.setState({ loading: true })
    message.info('Inscribiendo al usuario en la(s) clase(s)')
    const response = await confirmCheckout({ clases, isUnlimited, uid })
    message.success('El usuario fue inscrito en la(s) clase(s)')
    updateData()
    this.setState({ loading: false, cart: {} })
  }

  getStatus = () => {
    const { gymSelected } = this.state
    const { ilimitado } = this.props

    return ilimitado
      ? ilimitado[gymSelected]
        ? moment(ilimitado[gymSelected].fin) > moment()
        : null
      : null
  }

  render() {
    const {
      gymSelected,
      sucursales,
      clases,
      creditos,
      cart,
      loading,
      userClases
    } = this.state
    const { expires, ilimitado } = this.props

    const unlimited = ilimitado
      ? ilimitado[gymSelected]
        ? ilimitado[gymSelected].fin
        : null
      : null

    const isUnlimited = this.getStatus()

    const cartLength = Object.keys(cart).length
    const sucursalCredits =
      typeof creditos[gymSelected] === 'undefined' ? 0 : creditos[gymSelected]
    return (
      <div className="row">
        <div className="col-12">
          <h2>Calendario</h2>
          {isUnlimited ? (
            <h4>Paquete ilímitado, vence: {moment(unlimited).format('LL')}</h4>
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

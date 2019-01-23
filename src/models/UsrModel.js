import React, { Fragment } from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import Input from '../components/Input'
import { registerUser } from '../actions/firebase_auth'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Icon from 'antd/lib/icon'
import { updateDocument } from '../actions/firebase_actions'
import Datepicker from '../Form/Datepicker'
import message from 'antd/lib/message'

export default () => {
  return (
    <Datatable
      model="usuario"
      Inputs={Inputs}
      Columns={Columns}
      submit={submit}
    />
  )
}

const submit = async model => {
  // return { direccion: { calle: model.nombre, cp: model.contrasena }, ...model }
  const { id } = model
  // console.log(id)
  const response = id
    ? await updateDocument('usuario')({
        ...model,
        fecha_nacimiento: moment(model.fecha_nacimiento).format()
      })
    : await registerUser(model)

  if (id && response === 202) message.success('Usuario actualizado')
  else message.error('Ocurrió un error,por favor vuelve a intentarlo')
  return false
}

const Columns = (showModal, setDataToState) => {
  return [
    {
      label: 'Nombre',
      key: 'nombre',
      Render: element => <span>{element.nombre}</span>
    },
    { label: 'Correo', key: 'correo' },
    {
      label: 'Fecha de corte',
      Render: ({ expires, ilimitado }) => {
        // const rioja = creditos ? +creditos['-LJ5w7hFuZxYmwiprTIY'] : 0
        // const valle = creditos ? +creditos['-LPqzwORZYklJWDEgtv0'] : 0
        return (
          <span>
            {ilimitado ? (
              moment(ilimitado.fin) > moment() ? (
                moment(ilimitado.fin).format('LL') + ' (ilimitado)'
              ) : moment(expires) > moment() ? (
                moment(expires).format('LL')
              ) : (
                <span className="lightgray line-through">
                  {moment(expires).format('LL')}
                </span>
              )
            ) : (
              <span
                className={`${
                  moment(expires) > moment() ? '' : 'lightgray line-through'
                }`}
              >
                {moment(expires).format('LL')}
              </span>
            )}
            {/* {ilimitado
              ? moment(ilimitado.fin).format() > moment().format()
                ? moment(ilimitado.fin).format('LL')
                : creditos
                ? rioja + valle
                : 'Ya venció'
              : 'No tiene mes(es) ilimitados'} */}
          </span>
        )
      }
    },
    {
      label: 'Status',
      key: 'actions',
      Render: selected => (
        <DatatableActions
          model="usuario"
          selected={selected}
          setDataToState={setDataToState}
        />
      )
    },
    {
      label: 'Acciones',
      key: 'actions',
      Render: selected => (
        <div>
          <Link to={`/usr/${selected.id}`}>
            <Icon type="eye" /> Ver calendario
          </Link>
          <DatatableActions
            model="usuario"
            selected={selected}
            showModal={showModal}
          />
        </div>
      )
    }
  ]
}

const Inputs = ({
  id,
  nombre,
  edad,
  telefono,
  correo,
  contrasena,
  fecha_nacimiento
}) => {
  return (
    <React.Fragment>
      <Input
        name="nombre"
        label="Nombre"
        value={nombre}
        validations="minLength:3"
        validationError="Ingresa un nombre válido"
        required
      />
      <Input
        name="edad"
        label="Edad"
        value={edad}
        validations={{ maxLength: 2, isNumeric: true }}
        validationError="Ingresa una edad válida"
        required
      />
      {!id && (
        <Input
          name="correo"
          label="Correo"
          value={correo}
          validations="isEmail"
          validationError="Ingresa un email válido"
          required
        />
      )}
      <Input
        name="telefono"
        label="Teléfono"
        value={telefono}
        validations={{ maxLength: 10, isNumeric: true }}
        validationError="Ingresa un número de teléfono válido"
        required
      />
      <Datepicker
        name="fecha_nacimiento"
        placeholder="Fecha de nacimiento"
        label="Fecha de nacimiento"
        required
        defaultValue={fecha_nacimiento ? moment(fecha_nacimiento) : moment()}
      />
      {!id && (
        <Fragment>
          <Input
            name="contrasena"
            label="Contraseña"
            value={contrasena}
            validations="minLength:6"
            type="password"
            validationError="Ingresa una contraseña válida"
            required
          />
          <Input
            name="confirmar"
            label="Confirmar contraseña"
            validations="equalsField:contrasena"
            type="password"
            validationError="Las contraseñas no coinciden"
            required
          />
        </Fragment>
      )}
      <Input name="id" type="hidden" hidden value={id} />
    </React.Fragment>
  )
}

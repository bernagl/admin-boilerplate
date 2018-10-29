import React from 'react'
import Datatable from '../components/Datatable'
import DatatableActions from '../components/DatatableActions'
import { Tooltip } from 'antd'
import Input from '../components/Input'
import { registerUser } from '../actions/firebase_auth'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Icon from 'antd/lib/icon'

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
  const response = registerUser(model)
  if (response) return false
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
      label: 'Créditos',
      Render: ({ creditos, ilimitado }) => (
        <span>
          {ilimitado ? (
            moment(ilimitado.fin).format() > moment().format() ? (
              <Tooltip title="Tiene paquete ilímitado">
                {creditos['-LJ5w7hFuZxYmwiprTIY']} •
              </Tooltip>
            ) : (
              creditos['-LJ5w7hFuZxYmwiprTIY']
            )
          ) : (
            creditos['-LJ5w7hFuZxYmwiprTIY']
          )}
        </span>
      )
      // <span>{creditos['-LJ5w7hFuZxYmwiprTIY']}</span>
    },
    {
      label: 'Fecha de corte',
      Render: ({ ilimitado }) => (
        <span>
          {ilimitado
            ? moment(ilimitado.fin).format() > moment().format()
              ? moment(ilimitado.fin).format('LL')
              : 'Ya venció'
            : 'No tiene mes(es) ilimitados'}
        </span>
      )
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

const Inputs = ({ nombre, edad, telefono, correo, contrasena }) => {
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
      <Input
        name="correo"
        label="Correo"
        value={correo}
        validations="isEmail"
        validationError="Ingresa un email válido"
        required
      />
      <Input
        name="telefono"
        label="Teléfono"
        value={telefono}
        validations={{ maxLength: 10, isNumeric: true }}
        validationError="Ingresa un número de teléfono válido"
        required
      />
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
    </React.Fragment>
  )
}

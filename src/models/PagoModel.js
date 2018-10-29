import React from 'react'
import Table from 'react-xtable'
import { DatePicker, Icon, message, Select, Popconfirm } from 'antd'
import {
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { Link } from 'react-router-dom'

const { RangePicker } = DatePicker

export default class Pago extends React.Component {
  state = { data: [], dataCopy: [], showCancelled: true }
  async componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const data = await getDocumentsByModel('pago')
    const dataOrdered = data.sort(
      (a, b) =>
        moment(a.fecha) < moment(b.fecha)
          ? 1
          : moment(a.fecha) > moment(b.fecha)
            ? -1
            : 0
    )

    this.setState({
      data: dataOrdered,
      dataCopy: dataOrdered,
      type: 'todos',
      dates: null
    })
  }

  cancelarPago = async id => {
    const response = await updateDocument('pago')({ status: 2, id })
    if (response === 202) {
      this.getData()
      message.success('El pago ha sido cancelado')
    } else message.info('Ocurrió un error, por favor vuelve a intentarlo')
  }

  columns = [
    {
      label: 'Nombre',
      key: 'usuario'
    },
    {
      label: 'Fecha',
      key: 'fecha',
      Render: ({ fecha }) => <span>{moment(fecha).format('LL')}</span>
    },
    {
      label: 'Paquete',
      key: 'tipo',
      Render: ({ name }) => <span>{name}</span>
    },
    {
      label: 'Sucursal',
      key: 'sucursal',
      // Render: ({ name }) => <span>{name}</span>
    },
    {
      label: 'Método',
      key: 'metodo',
      Render: ({ tarjeta, last4 }) => (
        <span>
          {tarjeta} - {last4}
        </span>
      )
    },
    {
      label: 'Precio',
      key: 'precio',
      Render: ({ precio }) => (
        <span>
          MXN$
          {precio}
        </span>
      )
    },
    {
      label: 'Acciones',
      Render: ({ id, precio, name, status, usuario, uid }) => (
        <div>
          <div>
            <Link to={`/usr/${uid}`}>
              <Icon type="user" /> Ver usuario
            </Link>
          </div>
          <div>
            {status === 2 ? (
              'Cancelado'
            ) : (
              <Popconfirm
                title={
                  <span>
                    ¿Desea cancelar <b>{name} </b> de <b>{usuario}</b> por{' '}
                    <b>${precio}</b> MXN ?
                  </span>
                }
                placement="left"
                okText="Si"
                cancelText="No"
                onConfirm={() => this.cancelarPago(id)}
                className="a-warning"
              >
                <Icon type="close-circle" theme="outlined" /> {' Cancelar '}
              </Popconfirm>
            )}
          </div>
        </div>
      )
    }
  ]

  handleSelect = (t, d) => {
    const { showCancelled: sc } = this.state
    const showCancelled = !sc
    const type = t ? t : this.state.type
    const dates = d ? (d.length > 0 ? d : null) : this.state.dates
    const { dataCopy } = this.state
    let data = []
    if (type === 'todos') {
      data = showCancelled
        ? dataCopy
        : dataCopy.filter(({ status }) => {
            console.log(status)
            return status !== 2
          })
    } else {
      data = showCancelled
        ? dataCopy.filter(pago => pago.type === type)
        : dataCopy.filter(({ type: t, status }) => t === type && status !== 2)
    }
    if (dates) this.handleDates(data, type, showCancelled)(dates)
    else this.setState({ data, type, dates, showCancelled })
  }

  handleDates = (d, type, showCancelled) => dates => {
    const data = d.filter(pago => {
      const f = moment(pago.fecha)
      let status = false
      status = f >= dates[0] ? true : false
      status = f <= dates[1] ? (status ? true : false) : false

      return status
    })

    this.setState({ data, dates, type, showCancelled })
  }

  // handleCancelled = () => {
  //   const { showCancelled } = this.state
  //   this.handleSelect(null, null, !showCancelled)
  // }

  render() {
    const { data, showCancelled } = this.state
    return (
      <div className="row">
        <div className="col-12 my-3">
          <CSVLink data={data}>
            Exportar <Icon type="file-excel" />
          </CSVLink>
        </div>
        <div className="col-12 mb-3">
          <a onClick={() => this.handleSelect()}>
            {showCancelled
              ? 'Ocultar pagos cancelados'
              : 'Mostrar pagos cancelados'}
          </a>
        </div>
        <div className="col-6">
          <Select
            onChange={type => this.handleSelect(type, null)}
            placeholder="Filtar por..."
            className="fw"
            // value={select}
          >
            <Select.Option key="todos">Todos</Select.Option>
            <Select.Option key="subscripcion">Suscripción</Select.Option>
            <Select.Option key="paquete">Créditos</Select.Option>
          </Select>
        </div>
        <div className="col-6">
          <RangePicker
            placeholder={['Desde', 'Hasta']}
            format="DD-MM-YYYY"
            onChange={dates => this.handleSelect(null, dates)}
          />
        </div>
        <div className="col-12 my-3">
          <Table
            data={data}
            columns={this.columns}
            pagination={50}
            searchPlaceholder="Buscar"
            emptyText={() => 'Esta tabla aún no tiene ningún dato'}
          />
        </div>
      </div>
    )
  }
}

// export default () => {
//   return (
//     // <Datatable
//     //   model="pago"
//     //   title="Detalles del pago"
//     //   Inputs={Inputs}
//     //   showHideDisabled={true}
//     //   Columns={Columns}
//     //   download={true}
//     //   submit={submit}
//     // />
//   )
// }

// const submit = model => {
//   return model
// }

const Columns = () => {
  return [
    { label: 'Créditos', key: 'creditos' },
    { label: 'Tipo', key: 'tipo', Render: ({ name }) => <span>{name}</span> },
    {
      label: 'Precio',
      key: 'precio',
      Render: ({ precio }) => (
        <span>
          MXN$
          {precio}
        </span>
      )
    },
    {
      label: 'Fecha',
      key: 'fecha',
      Render: ({ fecha }) => <span>{moment(fecha).format('LL')}</span>
    },
    {
      label: 'Método',
      key: 'metodo',
      Render: ({ tarjeta, last4 }) => (
        <span>
          {tarjeta} - {last4}
        </span>
      )
    }
  ]
}

const Inputs = ({
  nombre,
  correo,
  paquete,
  precio,
  fecha,
  name,
  tarjeta,
  last4
}) => {
  return (
    <React.Fragment>
      <p>Usuario: {nombre}</p>
      <p>Correo: {correo}</p>
      <p>Paquete: {name}</p>
      <p>
        Precio: MXN$
        {precio}
      </p>
      <p>Fecha: {moment(fecha).format('LL')}</p>
      <p>
        Método: {tarjeta} - {last4}
      </p>
    </React.Fragment>
  )
}

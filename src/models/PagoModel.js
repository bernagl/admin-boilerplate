import React from 'react'
import Table from 'react-xtable'
import { DatePicker, Icon, Select } from 'antd'
import { getDocumentsByModel } from '../actions/firebase_actions'
import { CSVLink } from 'react-csv'
import moment from 'moment'

const { RangePicker } = DatePicker

export default class Pago extends React.Component {
  state = { data: [], dataCopy: [] }
  async componentDidMount() {
    const data = await getDocumentsByModel('pago')
    this.setState({ data, dataCopy: data, type: null, dates: null })
  }

  columns = [
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
      label: 'Usuario',
      key: 'usuario'
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

  handleSelect = type => {
    const { dataCopy, dates } = this.state
    let data = []
    if (type === 'todos') data = dataCopy
    else data = dataCopy.filter(pago => pago.type === type)
    if (dates) this.handleDates(data)(dates)
    else this.setState({ data, type })
  }

  handleDates = d => dates => {
    // const { data: d, dataCopy, type } = this.state
    // const dFilter = type ? (type === 'todos' ? dataCopy : d) : dataCopy
    const data = d.filter(pago => {
      const f = moment(pago.fecha)
      let status = false
      status = f >= dates[0] ? true : false
      status = f <= dates[1] ? (status ? true : false) : false

      return status
    })

    this.setState({ data, dates })
  }

  render() {
    const { data, dataCopy, type } = this.state
    return (
      <div className="row">
        <div className="col-12 my-3">
          <CSVLink data={data}>
            Exportar <Icon type="file-excel" />
          </CSVLink>
        </div>
        <div className="col-6">
          <Select
            onChange={this.handleSelect}
            placeholder="Filtar por..."
            className="fw"
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
            onChange={dates => this.handleDates(type ? data : dataCopy)(dates)}
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

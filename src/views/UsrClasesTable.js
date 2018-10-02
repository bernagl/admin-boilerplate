import React, { Component } from 'react'
import { getDocument } from '../actions/firebase_actions'
import Table from '../components/EraserTable'
import { Popconfirm, Popover, Tag } from 'antd'
import moment from 'moment'
import { cancelarClase } from '../actions/user_actions'
import message from 'antd/lib/message'

export default class ClasesTable extends Component {
  state = { clases: [] }
  componentDidMount() {
    const { clases } = this.props
    this.setState({ clases })
  }

  componentDidUpdate(oldProps) {
    const { clases } = this.props
    if (oldProps.clases === clases) return
    this.setState({ clases })
  }

  cancelarClase = async clase => {
    const {
      gimnasio: { id: sid },
      costo,
      id: cid
    } = clase
    const { uid, updateData } = this.props
    const response = await cancelarClase({ sid, costo, cid, uid })
    if (response === 202) {
      message.success('Clase cancelada')
      updateData()
    } else message.error('Ocurrió un error, por favor vuelve a intentarlo')
  }

  render() {
    const { clases } = this.state
    return <Table title="Clase(s)" data={clases} cols={this.clasesCol()} />
  }

  clasesCol = () => [
    {
      label: 'Clase',
      Render: ({ clase: { nombre } }) => <span>{nombre}</span>
    },
    {
      label: 'Coach',
      Render: ({ instructor: { nombre } }) => <span>{nombre}</span>
    },
    {
      label: 'Fecha',
      key: 'fecha',
      Render: ({ inicio }) => <span>{moment(inicio).format('LL')}</span>
    },
    {
      label: 'Hora',
      key: 'hora',
      Render: ({ inicio }) => <span>{moment(inicio).format('LT')}</span>
    },
    { label: 'Créditos', key: 'costo' },
    {
      label: 'Estatus',
      key: 'status',
      Render: item => {
        return (
          <React.Fragment>
            <Popover
              content={
                <p>
                  {item.status === 0
                    ? 'La fecha aún no se cumple'
                    : item.status === 2
                      ? 'Cancelaste la clase'
                      : item.status === 3
                        ? 'Estas en la lista de espera, si algún usuario cancela se te notificará por correo'
                        : 'La clase ya pasó'}
                </p>
              }
              title={
                item.status === 0
                  ? 'Pendiente'
                  : item.status === 1
                    ? 'Cumplida'
                    : item.status === 3
                      ? 'En cola'
                      : 'Cancelada'
              }
            >
              <Tag
                color={`${
                  item.status === 0
                    ? 'green'
                    : item.status === 3
                      ? 'blue'
                      : 'volcano'
                }`}
              >
                {item.status === 0
                  ? 'Pendiente'
                  : item.status === 2
                    ? 'Cancelada'
                    : item.status === 3
                      ? 'En lista de espera'
                      : 'Cumplida'}
              </Tag>
            </Popover>
            {item.status === 0 && (
              <Popconfirm
                title="¿Deseas cancelar la clase?"
                okText="Si"
                cancelText="No"
                onConfirm={() => this.cancelarClase(item)}
              >
                <Tag color="red">Cancelar</Tag>
              </Popconfirm>
            )}
          </React.Fragment>
        )
      }
    }
  ]
}

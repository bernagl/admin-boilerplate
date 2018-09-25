import React from 'react'
import Tabs from 'antd/lib/tabs'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Form from 'antd/lib/form'
import Datepicker from 'antd/lib/date-picker'
import Table from '../components/EraserTable'
import { Popconfirm, Button, Popover, Tag } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Clases from '../views/Clases'

const { Item } = Form

const { TabPane } = Tabs

export default class extends React.Component {
  logsCol = () => [
    { label: 'Log', key: 'type' },
    { label: 'Fecha', Render: ({ date }) => moment(date).format('LL') },
    { label: 'Usuario', key: 'user' }
  ]

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

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <h2>Luis García</h2>
          <Tag color="green">Suscripción activa</Tag>
        </div>
        <div className="col-12">
          <Tabs defaultActiveKey="1" onChange={e => console.log(e)}>
            <TabPane tab="Perfil" key="1">
              <div className="row">
                <div className="col-6">
                  <Form layout={{ formLayout: 'horizontal' }}>
                    <Item label="Nombre">
                      <Input placeholder="Nombre completo" />
                    </Item>
                    <Item label="Correo">
                      <Input placeholder="Correo" />
                    </Item>
                    <Item label="Teléfono">
                      <Input placeholder="Teléfono" />
                    </Item>
                    <Item label="Créditos">
                      <InputNumber
                        min={1}
                        max={10}
                        defaultValue={3}
                        onChange={e => console.log(e)}
                      />
                    </Item>
                    <Item label="Fin de paquete ilímitado">
                      <Datepicker />
                    </Item>
                    <Button type="primary" className="fw">Guardar</Button>
                  </Form>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Clases" key="2">
              <Table
                title="Clase(s)"
                data={[
                  {
                    clase: { nombre: 'SPINNING' },
                    instructor: { nombre: 'Pamela' },
                    inicio: moment().format(),
                    costo: 1,
                    status: 1
                  }
                ]}
                cols={this.clasesCol()}
              />
            </TabPane>
            <TabPane tab="Calendario" key="3">
              <Clases />
            </TabPane>
            <TabPane tab="Logs" key="4">
              <Table
                title="Log(s)"
                data={[
                  {
                    type: '+3 Créditos',
                    date: moment().format(),
                    user: 'Admin'
                  },
                  {
                    type: '+3 días',
                    date: moment().format(),
                    user: 'Admin'
                  },
                  {
                    type: 'Clase reservada',
                    date: moment().format(),
                    user: 'Usuario'
                  },
                  {
                    type: 'Clase reservada',
                    date: moment().format(),
                    user: 'Admin'
                  }
                ]}
                cols={this.logsCol()}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

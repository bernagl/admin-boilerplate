import React, { Component, Fragment } from 'react'
import { Form as F, InputNumber, Button, message, TimePicker } from 'antd'
import Form from '../Form/Form'
import Input from '../Form/Input'
import { Select, Option } from '../Form/Select'
import Datepicker from '../Form/Datepicker'
import {
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import { getSalones } from '../actions/horario_actions'
import moment from 'moment'

const { Item } = F

export default class extends Component {
  state = {
    instructores: [],
    salon: null,
    salones: [],
    instructor: null,
    inicio: null,
    fecha: null,
    fin: null,
    cupo: null,
    costo: null
  }

  componentDidMount() {
    this.setData()
  }

  setData = async () => {
    const { gimnasio, inicio, fin, cupo, costo } = this.props.event
    const salones = await getSalones(gimnasio.id)
    const instructores = await getDocumentsByModel('instructor')
    this.setState({ instructores, salones, inicio, fin, cupo, costo })
  }

  submit = async model => {
    const {
      event: { id },
      updatedClass
    } = this.props
    const { inicio, fin, cupo, costo, salones, instructores } = this.state
    const salon = salones.find(s => s.id === model.salon)
    const instructor = instructores.find(s => s.id === model.instructor)
    await updateDocument('horario')({
      id,
      ...model,
      fecha: moment(model.fecha).format(),
      inicio: moment(
        `${moment(model.fecha).format('YYYY-MM-DD')}T${moment(inicio).format(
          'HH:mm'
        )}`
      ).format(),
      fin: moment(
        `${moment(model.fecha).format('YYYY-MM-DD')}T${moment(fin).format(
          'HH:mm'
        )}`
      ).format(),
      cupo,
      costo,
      salon,
      instructor
    })
    updatedClass()
    return true
  }

  setValue = (key, value) => {
    this.setState({ [key]: value })
  }

  render() {
    const {
      id,
      salon,
      instructor,
      inicio,
      fecha,
      fin,
      cupo,
      costo
    } = this.props.event
    const { instructores, salones } = this.state
    return (
      <Form submit={this.submit} shouldUpdate>
        <div className="row">
          <div className="col-12">
            <Select
              defaultValue={salon.id}
              name="salon"
              label="Selecciona un salón"
            >
              {salones.map(({ nombre, id }, key) => (
                <Option key={id}>{nombre}</Option>
              ))}
            </Select>
          </div>
          <div className="col-12">
            <Select
              defaultValue={instructor.id}
              name="instructor"
              label="Selecciona un instructor"
            >
              {instructores.map(({ nombre, id }, key) => (
                <Option key={id}>{nombre}</Option>
              ))}
            </Select>
          </div>
          <div className="col-4">
            <Datepicker
              defaultValue={moment(fecha)}
              name="fecha"
              label="Fecha"
              placeholder="Selecciona una fecha"
            />
          </div>
          <div className="col-4">
            <Item label="Hora inicio" layout="vertical">
              <TimePicker
                onChange={inicio => this.setValue('inicio', inicio)}
                defaultValue={moment(inicio)}
              />
            </Item>
          </div>
          <div className="col-4">
            <Item label="Hora fin" layout="vertical">
              <TimePicker
                onChange={fin => this.setValue('fin', fin)}
                defaultValue={moment(fin)}
              />
            </Item>
          </div>
          <div className="col-3">
            <Item label="Cupo" layout="vertical">
              <InputNumber
                min={1}
                max={100}
                defaultValue={cupo}
                onChange={cupo => this.setValue('cupo', cupo)}
              />
            </Item>
          </div>
          <div className="col-3">
            <Item label="Costo (créditos)" layout="vertical">
              <InputNumber
                min={1}
                max={100}
                defaultValue={costo}
                onChange={costo => this.setValue('costo', costo)}
              />
            </Item>
          </div>
        </div>
      </Form>
    )
  }
}

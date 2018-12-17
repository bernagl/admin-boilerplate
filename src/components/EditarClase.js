import React, { Component, Fragment } from 'react'
import { Form as F, Button, message } from 'antd'
import Form from '../Form/Form'
import TimePicker from '../Form/Timepicker'
import InputNumber from '../Form/Inputnumber'
import { Select, Option } from '../Form/Select'
import Datepicker from '../Form/Datepicker'
import {
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import { getSalones } from '../actions/horario_actions'
import moment from 'moment'

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

  componentWillReceiveProps(nextProps) {
    if (this.props.event.id === nextProps.event.id) return
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
    const { inicio, fin, salones, instructores } = this.state
    const salon = salones.find(s => s.id === model.salon)
    const instructor = instructores.find(s => s.id === model.instructor)
    await updateDocument('horario')({
      id,
      status: 1,
      ...model,
      fecha: moment(model.fecha).format(),
      inicio: moment(
        `${moment(model.fecha).format('YYYY-MM-DD')}T${moment(
          model.inicio
        ).format('HH:mm')}`
      ).format(),
      fin: moment(
        `${moment(model.fecha).format('YYYY-MM-DD')}T${moment(model.fin).format(
          'HH:mm'
        )}`
      ).format(),
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
    console.log(this.props.event)
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
              defaultValue={moment(inicio)}
              name="fecha"
              label="Fecha"
              placeholder="Selecciona una fecha"
            />
          </div>
          <div className="col-4">
            <TimePicker
              defaultValue={moment(inicio)}
              name="inicio"
              label="Inicio"
              placeholder="Selecciona una hora de inicio"
            />
          </div>
          <div className="col-4">
            <TimePicker
              name="fin"
              label="fin"
              placeholder="Selecciona una hora de fin"
              defaultValue={moment(fin)}
            />
          </div>
          <div className="col-6">
            <InputNumber
              name="cupo"
              label="Cupo (total de alumnas)"
              placeholder="Selecciona un cupo"
              min={1}
              max={100}
              defaultValue={cupo}
            />
          </div>
          <div className="col-6">
            <InputNumber
              name="costo"
              label="Costo (créditos)"
              placeholder="Selecciona el costo de la clase"
              min={1}
              max={100}
              defaultValue={costo}
            />
          </div>
        </div>
      </Form>
    )
  }
}

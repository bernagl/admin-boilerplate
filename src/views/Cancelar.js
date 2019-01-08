import React from 'react'
import Divider from 'antd/lib/divider'
import moment from 'moment'
import Form from '../Form/Form'
import Datepicker from '../Form/Datepicker'
import Timepicker from '../Form/Timepicker'
import { getDocumentsByModel } from '../actions/firebase_actions'
import Button from 'antd/lib/button'
import message from 'antd/lib/message'
import Tag from 'antd/lib/tag'
import { cancelarClase, getUsuarios } from '../actions/clase_actions'
import { sendMail } from '../actions/mail_actions'

export default class extends React.Component {
  state = { clasesToCancel: null }

  submit = async model => {
    if (
      moment(model.fechaInicio) < moment() ||
      moment(model.fechaFin) < moment()
    ) {
      message.info('La fecha de inicio y fecha fin no pueden ser días pasados')
      return
    }

    const clases = await getDocumentsByModel('horario')
    const comparing = this.isInRange(model)
    const clasesToCancel = []
    clases.forEach(clase => {
      if (clase['status'] !== 2) {
        const result = comparing(clase)
        result ? clasesToCancel.push(result) : false
      }
    })

    if (clasesToCancel.length > 0) this.setState({ clasesToCancel })
    else {
      message.error('No se encontraron clases con las fechas ingresadas')
      this.setState({ clasesToCancel: null })
    }

    return true
  }

  isInRange = ({ fechaInicio, fechaFin, horaInicio }) => clase => {
    const isOnRange =
      moment(fechaInicio).format('YYYYMMDD') <=
        moment(clase.fecha).format('YYYYMMDD') &&
      moment(fechaFin).format('YYYYMMDD') >=
        moment(clase.fecha).format('YYYYMMDD')
        ? true
        : false

    if (isOnRange) {
      return moment(horaInicio).format('LT') ===
        moment(clase.inicio).format('LT')
        ? clase
        : false
    }

    return false
  }

  cancelledConfirm = async () => {
    const { clasesToCancel } = this.state
    message.info(
      'Obteniendo usuarios inscritos en clases para notificarles y restaurar sus creditos'
    )
    const responsePromise = clasesToCancel.map(async (clase, i) => {
      const usuarios = await getUsuarios(clase.id)
      await sendMail(
        usuarios,
        {
          instructora: clase.instructor.nombre,
          inicio: moment(clase.inicio).format('LLLL')
        },
        'Cancelamiento de clases'
      )
      return await cancelarClase({ clase, usuarios })
    })

    const responseResolve = await Promise.all(responsePromise)
    this.setState({ clasesToCancel: null }, () =>
      message.success('Las clases fueron canceladas')
    )
  }

  render() {
    const { clasesToCancel } = this.state
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <h2>Cancelar clases</h2>
          <Divider />
          <Form
            submit={this.submit}
            shouldUpdate
            submitText="Buscar"
            fullSubmitButton
          >
            <Datepicker name="fechaInicio" label="Fecha inicio" />
            <Datepicker name="fechaFin" label="Fecha final" />
            <Timepicker name="horaInicio" label="Hora de clase" />
          </Form>
        </div>
        <div className="col-12 col-md-6">
          {clasesToCancel && (
            <div className="row">
              <div className="col-12 mb-2">
                <Tag color="red">
                  Se van cancelar {clasesToCancel.length} clases
                </Tag>
              </div>
              <div className="col-12 mb-2">
                Si está seguro de esta acción presione el botón cancelar
              </div>
              <div className="col-12">
                <Button
                  type="danger"
                  className="full-width"
                  onClick={this.cancelledConfirm}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

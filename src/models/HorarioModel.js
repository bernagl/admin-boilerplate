import React, { Component } from 'react'
import {
  Button,
  message,
  InputNumber,
  Select,
  Form as F,
  TimePicker
} from 'antd'
import moment from 'moment'
import MultipleDatePicker from 'react-multiple-datepicker'
import AnimationWrapper from '../components/AnimationWrapper'
import Form from '../components/Form2'
import Input from '../components/Input'
import { getDocumentsByModel } from '../actions/firebase_actions'
import { createHorario } from '../actions/horario_actions'

const { Option } = Select
const { Item } = F

export default class Horario extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      clases: [],
      gimnasios: [],
      instructores: [],
      clase: '',
      gimnasio: '',
      instructor: ''
    }
  }

  async componentDidMount() {
    const clases = await getDocumentsByModel('clase')
    const gimnasios = await getDocumentsByModel('sucursal')
    const instructores = await getDocumentsByModel('instructor')

    this.setState({ clases, gimnasios, instructores })
  }

  submit = model => {
    const {
      clase,
      clases,
      cupo,
      gimnasio,
      gimnasios,
      instructor,
      instructores,
      inicio,
      fin,
      fechas
    } = this.state
    if (
      !clase ||
      !cupo ||
      !gimnasio ||
      !instructor ||
      !inicio ||
      !fin ||
      !fechas
    ) {
      message.error(
        'Todos los campos son validos, por favor revisa el formulario'
      )
      return
    }

    const count = fechas.map(async (fecha, key) => {
      const r = await createHorario({
        cupo,
        fecha: moment(fecha).format('L'),
        gimnasio: gimnasios[gimnasio],
        clase: clases[clase],
        inscritos_numero: 0,
        costo: 1,
        instructor: instructores[instructor],
        inicio: moment(
          `${moment(fecha).format('YYYY-MM-DD')}T${moment(inicio).format(
            'HH:mm'
          )}`
        ).format(),
        fin: moment(
          `${moment(fecha).format('YYYY-MM-DD')}T${moment(fin).format('HH:mm')}`
        ).format()
      })
      return r
    })

    message.success('Clases guardadas correctamente')
  }

  setValue = (key, value) => {
    this.setState({ [key]: value })
  }

  render() {
    const {
      clases,
      clase,
      gimnasio,
      gimnasios,
      instructor,
      instructores
    } = this.state
    return (
      <AnimationWrapper>
        <Form ref={this.formRef} submit={this.submit}>
          <div className="row">
            <div className="col-4">
              <Item label="Clases" layout="vertical">
                <Select
                  placeholder="Selecciona una clase"
                  notFoundContent="Ninguna clase encontrada"
                  onChange={clase => this.setState({ clase })}
                  tokenSeparators={[',']}
                >
                  {clases.map(({ nombre, id }, key) => (
                    <Option key={key}>{nombre}</Option>
                  ))}
                </Select>
              </Item>
              <Input type="hidden" name="clase" value={clase} />
            </div>
            <div className="col-4">
              <Item label="Gimnasio" layout="vertical">
                <Select
                  placeholder="Selecciona una gimnasio"
                  notFoundContent="Ningun gimnasio encontrado"
                  onChange={gimnasio => this.setState({ gimnasio })}
                  tokenSeparators={[',']}
                >
                  {gimnasios.map(({ nombre, id }, key) => (
                    <Option key={key}>{nombre}</Option>
                  ))}
                </Select>
              </Item>
              <Input type="hidden" name="gimnasio" value={gimnasio} />
            </div>
            <div className="col-4">
              <Item label="Profesor" layout="vertical">
                <Select
                  placeholder="Selecciona un instructor"
                  notFoundContent="Ningun instructor encontrado"
                  onChange={instructor => this.setState({ instructor })}
                  tokenSeparators={[',']}
                >
                  {instructores.map(({ nombre, id }, key) => (
                    <Option key={key}>{nombre}</Option>
                  ))}
                </Select>
              </Item>
              <Input type="hidden" name="instructor" value={instructor} />
            </div>
            <div className="col-3">
              <MultipleDatePicker
                onSubmit={fechas => this.setValue('fechas', fechas)}
              />
            </div>
            <div className="col-3">
              <Item label="Hora inicio" layout="vertical">
                <TimePicker
                  onChange={inicio => this.setValue('inicio', inicio)}
                  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                />
              </Item>
            </div>
            <div className="col-3">
              <Item label="Hora fin" layout="vertical">
                <TimePicker
                  onChange={fin => this.setValue('fin', fin)}
                  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                />
              </Item>
            </div>
            <div className="col-3">
              <Item label="Cupo" layout="vertical">
                <InputNumber
                  min={1}
                  max={100}
                  defaultValue={10}
                  onChange={cupo => this.setValue('cupo', cupo)}
                />
              </Item>
            </div>
          </div>
          <Button type="primary" onClick={() => this.formRef.current.submit()}>
            Submit
          </Button>
        </Form>
      </AnimationWrapper>
    )
  }
}

import React, { Component } from 'react'
import {
  Button,
  message,
  InputNumber,
  Select,
  DatePicker,
  Form as F,
  TimePicker
} from 'antd'
import moment from 'moment'
import MultipleDatePicker from 'react-multiple-datepicker'
import AnimationWrapper from '../components/AnimationWrapper'
import Form from '../components/Form2'
import Input from '../components/Input'
import { getDocumentsByModel } from '../actions/firebase_actions'
import { createHorario, getDates, getSalones } from '../actions/horario_actions'
import { app } from '../../node_modules/firebase'

const { Option } = Select
const { Item } = F
const { RangePicker } = DatePicker

export default class Horario extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      clases: [],
      salones: [],
      cupo: 10,
      costo: 1,
      gimnasios: [],
      dias: [0, 1, 2, 3, 4, 5, 6],
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

  getSalones = async gimnasio => {
    const { gimnasios } = this.state
    const salones = await getSalones(gimnasios[gimnasio].id)
    console.log(salones)
    this.setState({ salones })
  }

  submit = model => {
    const {
      clase,
      clases,
      cupo,
      costo,
      dias,
      gimnasio,
      gimnasios,
      instructor,
      instructores,
      inicio,
      fin,
      fechas,
      salon,
      salones
    } = this.state
    if (
      !clases ||
      !cupo ||
      !gimnasio ||
      !instructor ||
      !inicio ||
      !fin ||
      !fechas ||
      !salon
    ) {
      message.error(
        'Todos los campos son validos, por favor revisa el formulario'
      )
      return
    }

    const fechasBetween = getDates(fechas[0], fechas[1], moment)
    const fechasFinal = fechasBetween.filter(fecha =>
      dias.includes(moment(fecha).day())
    )

    fechasFinal.map(async (fecha, key) => {
      const r = await createHorario({
        cupo,
        fecha: moment(fecha).format('L'),
        gimnasio: gimnasios[gimnasio],
        clase: clases[clase],
        inscritos_numero: 0,
        costo,
        salon: salones[salon],
        instructor: instructores[instructor],
        inicio: moment(`${fecha}T${moment(inicio).format('HH:mm')}`).format(),
        fin: moment(`${fecha}T${moment(fin).format('HH:mm')}`).format()
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
      cupo,
      costo,
      dias,
      gimnasio,
      gimnasios,
      instructor,
      instructores,
      salones
    } = this.state
    return (
      <AnimationWrapper>
        <div className="row">
          <div className="col-6">
            <Form ref={this.formRef} submit={this.submit}>
              <div className="row">
                <div className="col-12">
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
                <div className="col-12">
                  <Item label="Gimnasio" layout="vertical">
                    <Select
                      placeholder="Selecciona una gimnasio"
                      notFoundContent="Ningun gimnasio encontrado"
                      onChange={gimnasio => {
                        this.setState({ gimnasio }), this.getSalones(gimnasio)
                      }}
                      tokenSeparators={[',']}
                    >
                      {gimnasios.map(({ nombre, id }, key) => (
                        <Option key={key}>{nombre}</Option>
                      ))}
                    </Select>
                  </Item>
                  {/* <Input type="hidden" name="gimnasio" value={gimnasio} /> */}
                </div>
                <div className="col-12">
                  <Item label="Salón" layout="vertical">
                    <Select
                      placeholder="Selecciona un salón"
                      notFoundContent="Primero selecciona un gimnasio"
                      onChange={salon => this.setState({ salon })}
                      tokenSeparators={[',']}
                    >
                      {salones.map(({ nombre, id }, key) => (
                        <Option key={key}>{nombre}</Option>
                      ))}
                    </Select>
                  </Item>
                  {/* <Input type="hidden" name="gimnasio" value={gimnasio} /> */}
                </div>
                <div className="col-12">
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
                <div className="col-12">
                  <Item label="Días de la semana">
                    <Select
                      mode="multiple"
                      placeholder="Días"
                      onChange={dias => this.setValue('dias', dias)}
                      defaultValue={dias}
                    >
                      <Select.Option value={0}>Domingo</Select.Option>
                      <Select.Option value={1}>Lunes</Select.Option>
                      <Select.Option value={2}>Martes</Select.Option>
                      <Select.Option value={3}>Miércoles</Select.Option>
                      <Select.Option value={4}>Jueves</Select.Option>
                      <Select.Option value={5}>Viernes</Select.Option>
                      <Select.Option value={6}>Sábado</Select.Option>
                    </Select>
                  </Item>
                </div>
                <div className="col-12">
                  <Item label="Fechas" layout="vertical">
                    <RangePicker
                      onChange={e => console.log(e)}
                      placeholder={['Inicio', 'Fin']}
                      className="fw"
                      onChange={fechas => this.setValue('fechas', fechas)}
                    />
                    {/* 
                <MultipleDatePicker
                  onSubmit={fechas => this.setValue('fechas', fechas)}
                  className="ant-input-number-input-wrap"
                />
              */}
                  </Item>
                </div>
                <div className="col-3">
                  <Item label="Hora inicio" layout="vertical" className="fw">
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
              <Button
                type="primary"
                onClick={() => this.formRef.current.submit()}
              >
                Asignar clases
              </Button>
            </Form>
          </div>
        </div>
      </AnimationWrapper>
    )
  }
}

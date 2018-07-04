import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import Table from 'react-xtable'
import Form from './Form2'
import {
  addDocument,
  getDocumentsByModel,
  updateDocument
} from '../actions/firebase_actions'
import '../assets/xtable.css'

export default class Datatable extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = { selected: null, modal: false, data: [] }
  }

  componentDidMount() {
    this.setDataToState(this.props.model)
  }

  setDataToState = async model => {
    // this.setState({ data: [] })
    const data = await getDocumentsByModel(this.props.model)
    this.setState({ data })
  }

  showModal = selected => {
    this.setState({ selected, modal: true })
  }

  closeModal = () => {
    this.setState({ selected: {}, modal: false })
  }

  handleOk = () => {
    this.formRef.current.submit()
  }

  render() {
    const { data, selected, loading, modal } = this.state
    const { Columns, Inputs, model, submit, title } = this.props
    const action = selected ? updateDocument(model) : addDocument(model)
    return (
      <div>
        <Table
          data={data}
          columns={Columns(this.showModal)}
          pagination={50}
          searchPlaceholder="Buscar"
          emptyText={() => 'Esta tabla aún no tiene ningún dato'}
        />
        <Modal
          title={
            title ? title : selected ? `Editar ${model}` : `Agregar ${model}`
          }
          visible={modal}
          onOk={this.handleOk}
          okText="Guardar"
          onCancel={this.closeModal}
          cancelText="Cancelar"
          confirmLoading={loading}
          destroyOnClose={true}
        >
          <Form
            updateData={this.setDataToState}
            action={action}
            selected={selected}
            submit={submit}
            model={model}
            closeModal={this.closeModal}
            ref={this.formRef}
          >
            {Inputs(selected ? selected : {})}
          </Form>
        </Modal>
        <Button type="primary" onClick={() => this.showModal()}>
          Agregar
        </Button>
      </div>
    )
  }
}

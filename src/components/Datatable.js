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
    this.state = { loading: false, selected: null, modal: false, data: [] }
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
    this.setState({ selected: {}, modal: false, loading: false })
  }

  handleOk = () => {
    this.setState({ loading: true }, () => this.formRef.current.submit())
  }

  render() {
    const { data, selected, loading, modal } = this.state
    const { Columns, Inputs, model, submit, title } = this.props
    const action = selected ? updateDocument(model) : addDocument(model)
    return (
      <div className="row">
        <div className="col-12 my-2">
          <Button
            type="primary"
            onClick={() => this.showModal()}
            className="float-right"
          >
            Agregar
          </Button>
        </div>
        <div className="col-12">
          <Table
            columns={Columns(this.showModal, this.setDataToState)}
            data={data}
            emptyText={() => 'Esta tabla aún no tiene ningún dato'}
            footer={false}
            header={false}
            pagination={50}
            search={false}
            searchPlaceholder="Buscar"
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
        </div>
      </div>
    )
  }
}

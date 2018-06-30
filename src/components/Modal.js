import React from 'react'
import { Modal, Button } from 'antd'
import Form from './Form'

export default class ModalForm extends React.Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = { visible: false, loading: false }
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = e => {
    this.setState({ loading: true })
    this.formRef.current.submit()
    setTimeout(() => {
      this.setState({
        visible: false,
        loading: false
      })
    }, 2000)
  }

  handleCancel = e => {
    // console.log(this.formRef.current)
    // this.formRef.current.reset()
    this.setState({
      visible: false
    })
  }

  render() {
    const { loading, visible } = this.state
    const { model, selected, title } = this.props
    return (
      <Modal
        title={selected ? `Editar ${model}` : `Agregar ${model}`}
        visible={this.state.visible}
        onOk={this.handleOk}
        okText="Guardar"
        onCancel={this.handleCancel}
        cancelText="Cancelar"
        confirmLoading={this.state.loading}
        destroyOnClose={true}
      >
        <Form
          ref={this.formRef}
          model={this.props.model}
          selected={this.props.selected}
        />
      </Modal>
    )
  }
}

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
    const { action, callback, model, selected, title } = this.props
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
          submit={this.handleOk}
          ref={this.formRef}
          model={model}
          selected={selected}
          action={action}
          modalContext={this}
          callback={callback}
        />
      </Modal>
    )
  }
}

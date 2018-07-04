import React, { Component } from 'react'
import Formsy from 'formsy-react'
import { message } from 'antd'
import { getDocument } from '../actions/firebase_actions'

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.formsyRef = React.createRef()
  }

  async componentDidMount() {
    let { model, selected } = this.props
    if (selected) {
      const document = await getDocument(model)(selected.id)
      this.setState({ selected: document })
    } else {
      this.setState({ selected: {} })
    }
  }

  state = { canSubmit: false, loading: false }

  disableButton = () => {
    this.setState({ canSubmit: false })
  }

  enableButton = () => {
    this.setState({ canSubmit: true })
  }

  submit = async () => {
    const schema = this.formsyRef.current.getModel()
    const { closeModal, selected, submit, updateData } = this.props

    const { canSubmit } = this.state
    if (!canSubmit) {
      message.error('Por favor valida tu formulario')
      return
    }
    const customModel = await submit(schema)

    if (!customModel) {
      return
    }

    const response = await this.props.action({
      id: selected ? selected.id : null,
      ...customModel
    })

    if (response === 202) {
      closeModal()
      updateData()
      message.success('Registro guardado')
    } else {
      message.error('Ocurrió un error, por favor vuelve a intentarlo')
    }
  }

  render() {
    const { children } = this.props
    return (
      <Formsy
        onSubmit={this.submit}
        onValidSubmit={this.submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        ref={this.formsyRef}
        className="ant-form-vertical"
      >
        {children}
      </Formsy>
    )
  }
}

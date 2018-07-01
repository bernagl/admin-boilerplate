import React, { Component } from 'react'
import Formsy from 'formsy-react'
import { withRouter } from 'react-router-dom'
import { Button, Icon, message, Spin } from 'antd'
import { Forms } from '../models'
import Input from './Input'
import { addDocument, getDocument } from '../actions/firebase_actions'

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

  // componentWillReceiveProps(nextProps) {
  //   this.formsyRef.current.reset()
  // }

  disableButton = () => {
    this.setState({ canSubmit: false })
  }

  enableButton = () => {
    this.setState({ canSubmit: true })
  }

  submit = async () => {
    const { canSubmit } = this.state
    const { model, callback, modalContext, selected, submit } = this.props
    const schema = this.formsyRef.current.getModel()
    if (!canSubmit) {
      message.error('Por favor valida tu formulario')
      modalContext.setState({ loading: false })
      return
    }

    const response = await this.props.action({
      id: selected ? selected.id : null,
      ...schema
    })

    if (response === 202) {
      modalContext.setState({ loading: false, visible: false })
      callback()
      message.success('Registro guardado')
    } else {
      message.error('Ocurrió un error, por favor vuelve a intentarlo')
    }

    console.log(selected, model, schema)
    // const { action, uid, error, history, redirect, success } = this.props
    // this.setState({ loading: true })
    // const r = await action({ ...model, uid })
    // // this.setState(() => {
    // r
    //   ? (message.success(success),
    //     redirect ? history.push(redirect) : this.setState({ loading: false }))
    //   : (this.setState({ loading: false }),
    //     message.error(
    //       error ? error : 'Ocurrio un error, por favor intentalo de nuevo'
    //     ))
  }

  reset = () => {
    this.formsyRef.current.reset()
  }

  render() {
    const { canSubmit, selected, loading } = this.state
    const { children, submitText } = this.props
    const Model = Forms[this.props.model]
    return (
      <Formsy
        onSubmit={this.submit}
        onValidSubmit={this.submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        ref={this.formsyRef}
        className="ant-form-vertical"
      >
        {Model ? (
          selected ? (
            <Model {...selected} />
          ) : (
            <Spin
              indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
            />
          )
        ) : (
          <h5>No tienes ningún modelo</h5>
        )}

        {/* <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading ? true : !canSubmit ? true : false}
          className="fw mt-2"
        >
          {submitText} */}
        {/* </Button> */}
      </Formsy>
    )
  }
}

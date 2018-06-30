import React, { Component } from 'react'
import Formsy from 'formsy-react'
import { withRouter } from 'react-router-dom'
import { Button, message } from 'antd'
import Models from '../models'
import Input from './Input'

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.formsyRef = React.createRef()
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

  submit = () => {
    const { canSubmit } = this.state
    const { selected, model } = this.props
    const schema = this.formsyRef.current.getModel()
    if (!canSubmit) {
      message.error('Por favor valida tu formulario')
      return
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
    const { canSubmit, loading } = this.state
    const { children, selected, submitText } = this.props
    const Model = Models[this.props.model]
    console.log(selected)
    return (
      <Formsy
        onSubmit={this.submit}
        onValidSubmit={this.submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        ref={this.formsyRef}
        className="ant-form-vertical"
      >
        {Model ? <Model {...selected} /> : <h5>No tienes ningún modelo</h5>}

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

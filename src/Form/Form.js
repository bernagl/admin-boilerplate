import React, { Component } from 'react'
import Formsy from 'formsy-react'
import Button from 'antd/lib/button'
import Divider from 'antd/lib/divider'

class Form extends Component {
  static defaultProps = {
    centeredTitle: false,
    fullSubmitButton: false,
    loading: false,
    loadingData: false,
    submitText: 'Guardar',
    title: false,
    shouldUpdate: false,
    subtitle: false
  }

  state = { canSubmit: false, loading: false }

  disableButton = () => {
    this.setState({ canSubmit: false })
  }

  enableButton = () => {
    this.setState({ canSubmit: true })
  }

  submit = async model => {
    this.setState({ loading: true })
    const { shouldUpdate } = this.props
    if (shouldUpdate) {
      await this.props.submit(model)
      this.setState({ loading: false })
    } else await this.props.submit(model)
  }

  render() {
    const {
      centeredTitle,
      fullSubmitButton,
      loadingData,
      submitText,
      title,
      subtitle
    } = this.props
    const { canSubmit, loading } = this.state
    return (
      <Formsy
        onValidSubmit={this.submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        className={`${loadingData ? 'loading-indicator' : ''} my-3`}
      >
        {title && (
          <div className={`${centeredTitle ? 'center-text' : ''}`}>
            <h2 className="m-0">{title}</h2>
            <Divider />
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {this.props.children}
        <Button
          disabled={!canSubmit}
          htmlType="submit"
          loading={loading}
          type="primary"
          className={`${fullSubmitButton ? 'full-width' : ''} mt-3`}
        >
          {submitText}
        </Button>
      </Formsy>
    )
  }
}

export default Form

import React from 'react'
import { withFormsy } from 'formsy-react'
import Form from 'antd/lib/form'
const { Item } = Form

class Wrapper extends React.Component {
  state = { error: false, blurred: false, value: null }

  changeValue = value => {
    this.setState({ value }, () => this.props.setValue(value))
  }

  onBlur = () => {
    this.setState({ blurred: true })
  }

  componentDidUpdate(prevProps) {
    const { defaultValue, setValue } = this.props
    if (prevProps.defaultValue === defaultValue) return
    this.setState(
      ({ blurred }) =>
        typeof defaultValue !== 'undefined' ? { value: defaultValue, blurred: !blurred } : { blurred },
      () => defaultValue && setValue(defaultValue)
    )
  }

  componentDidMount() {
    const { defaultValue, setValue } = this.props
    this.setState(
      ({ blurred }) =>
        typeof defaultValue !== 'undefined' ? { value: defaultValue, blurred: !blurred } : { blurred },
      () => defaultValue && setValue(defaultValue)
    )
  }

  setRenderProps = () => ({
    onChange: this.changeValue,
    onBlur: this.onBlur,
    value: this.state.value
  })

  render() {
    const {
      children,
      className,
      // feedBack,
      // getErrorMessage,
      inputFeedback,
      isValid: validate,
      label,
      validationError
    } = this.props
    const { blurred, value } = this.state
    // const errorMessage = getErrorMessage()
    const isValid = validate()
    return (
      <Item
        layout="vertical"
        label={label}
        validateStatus={
          blurred ? (isValid ? 'success' : !isValid ? 'error' : null) : null
        }
        className={className}
        // help={blurred ? (!isValid ? errorMessage : null) : null}
        // hasFeedback={feedBack && blurred}
      >
        {children({ ...this.setRenderProps() })}
        {!isValid &&
          blurred && (
            <span className="input-form-label input-has-error">
              {validationError}
            </span>
          )}
        {inputFeedback &&
          isValid && (
            <a
              href={value}
              target="_blank"
              className="input-form-label input-has-deedback"
            >
              {value}
            </a>
          )}
      </Item>
    )
  }
}

export default withFormsy(Wrapper)

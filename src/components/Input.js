import React, { Component } from 'react'
import { Input as I, Form } from 'antd'
import { withFormsy } from 'formsy-react'
const { Item } = Form

class Input extends Component {
  state = { value: '', validate: false }

  componentDidMount() {
    this.setState({ value: this.props.value })
  }

  // componentWillReceiveProps(nextProps) {
  //   nextProps.value !== this.props.value &&
  //     (this.props.setValue(this.props.value), this.setState({ value: this.props.value }))
  // }

  onChange = e => {
    const value = e.currentTarget.value
    this.props.setValue(value)
    this.setState({ value })
  }

  handleEvent = e => {
    const value = e.currentTarget.value
    this.props.setValue(value)
    this.setState({ validate: true, value })
  }

  render() {
    const { validate, value } = this.state
    const { label, name, placeholder, type } = this.props
    const errorMessage = this.props.getErrorMessage()
    return (
      <Item
        label={label}
        layout="vertical"
        validateStatus={
          validate
            ? errorMessage
              ? 'error'
              : value
                ? 'success'
                : 'error'
            : null
        }
        help={validate && errorMessage}
        hasFeedback
      >
        <I
          placeholder={placeholder}
          name={name}
          type={type ? type : 'text'}
          onChange={this.onChange}
          onBlur={this.handleEvent}
          value={value}
          // pattern={pattern}
          // onFocus={this.handleEvent}
        />
      </Item>
    )
  }
}

export default withFormsy(Input)

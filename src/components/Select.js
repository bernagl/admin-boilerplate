import React, { Component } from 'react'
import { Select as S, Form } from 'antd'
import { withFormsy } from 'formsy-react'
const { Item } = Form
const { Option } = S

class Select extends Component {
  state = { value: '', validate: false }

  componentDidMount() {
    this.setState({ value: this.props.value })
  }

  onChange = value => {
    this.props.setValue(value)
    this.setState({ value })
  }

  handleEvent = value => {
    this.props.setValue(value)
    this.setState({ validate: true, value })
  }

  render() {
    const { validate, value } = this.state
    const { label, name, options, placeholder, type } = this.props
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
        <S
          //   placeholder={placeholder}
          name={name}
          //   type={type ? type : 'text'}
          //   onChange={this.onChange}
          //   onBlur={this.handleEvent}
          value={value}
          // mode="tags"
          placeholder={placeholder ? placeholder : 'Selecciona'}
          notFoundContent="Ninguna opción encontrada"
          // style={{ width: '100%' }}
          onChange={claseSelected => this.onChange(claseSelected)}
          //   tokenSeparators={[',']}
          // pattern={pattern}
          // onFocus={this.handleEvent}
        >
          {options.map(({ nombre, id }, key) => (
            <Option key={key}>{nombre}</Option>
          ))}
        </S>
      </Item>
    )
  }
}

export default withFormsy(Select)

import React, { Component } from 'react'
import { Select as S, Form } from 'antd'
import Input from './Input'
const { Item } = Form
const { Option } = S

class Select extends Component {
  state = { value: '', validate: false }

  componentDidMount() {
    this.setState({ value: this.props.defaultValue })
  }

  onChange = value => {
    this.setState({ value })
  }

  handleEvent = value => {
    this.setState({ validate: true, value })
  }

  render() {
    const { validate, value } = this.state
    const { label, name, options, placeholder, type, defaultValue } = this.props
    console.log(this.state)
    return (
      <Item
        label={label}
        layout="vertical"
        // validateStatus={
        //   validate
        //     ? errorMessage
        //       ? 'error'
        //       : value
        //         ? 'success'
        //         : 'error'
        //     : null
        // }
        // help={validate && errorMessage}
        hasFeedback
      >
        <S
          //   placeholder={placeholder}
          name={name}
          //   type={type ? type : 'text'}
          //   onChange={this.onChange}
          //   onBlur={this.handleEvent}
          // value={value}
          defaultValue={defaultValue}
          // mode="tags"
          placeholder={placeholder ? placeholder : 'Selecciona'}
          notFoundContent="Ninguna opción encontrada"
          // style={{ width: '100%' }}
          onChange={claseSelected => this.onChange(claseSelected)}
          //   tokenSeparators={[',']}
          value={value}
          // pattern={pattern}
          // onFocus={this.handleEvent}
        >
          {options.map(({ nombre, id }, key) => (
            <Option key={id ? id : key}>{nombre}</Option>
          ))}
        </S>
        {/* <Input type="hidden" name={name} value={value} /> */}
      </Item>
    )
  }
}

export default Select

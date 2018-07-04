import React, { Component } from 'react'
import { Select as S, Form } from 'antd'
const { Item } = Form
const { Option } = S

class Select extends Component {
  componentDidMount() {
    const { context, defaultValue, name } = this.props
    context.setState({ [name]: defaultValue })
  }

  render() {
    const {
      context,
      name,
      label,
      options,
      placeholder,
      defaultValue
    } = this.props
    return (
      <Item label={label} layout="vertical" hasFeedback>
        <S
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder ? placeholder : 'Selecciona'}
          notFoundContent="Ninguna opción encontrada"
          onChange={sucursal => context.setState({ sucursal })}
          className="fw"
        >
          {options.map(({ nombre, id }, key) => (
            <Option key={id ? id : key}>{nombre}</Option>
          ))}
        </S>
      </Item>
    )
  }
}

export default Select

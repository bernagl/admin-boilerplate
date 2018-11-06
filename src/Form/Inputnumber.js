import React from 'react'
import Parent from './Wrapper'
import InputNumber from 'antd/lib/input-number'
import PropTypes from 'prop-types'

export const Field = props => (
  <Parent {...props}>
    {({ onChange, onBlur, value }) => {
      return (
        <InputNumber
          placeholder={props.placeholder}
          name={props.name}
          value={value}
          id={props.name}
          onChange={value => onChange(value)}
          onBlur={value => onBlur(value)}
          type={props.type}
          min={props.min}
          max={props.max}
        />
      )
    }}
  </Parent>
)

export default Field

Field.defaultProps = {
  label: '',
  placeholder: '',
  type: 'text'
}

Field.propTypes = {
  // label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string
}

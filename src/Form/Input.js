import React from 'react'
import Parent from './Wrapper'
import Input from 'antd/lib/input'
import PropTypes from 'prop-types'

export const Field = props => (
  <Parent {...props}>
    {({ onChange, onBlur, value }) => {
      return (
        <Input
          placeholder={props.placeholder}
          name={props.name}
          value={value}
          id={props.name}
          onChange={({ target: { value } }) => onChange(value)}
          onBlur={({ target: { value } }) => onBlur(value)}
          type={props.type}
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

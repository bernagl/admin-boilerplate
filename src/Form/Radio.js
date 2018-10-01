import React from 'react'
import Parent from './Wrapper'
import Radio from 'antd/lib/radio'
import PropTypes from 'prop-types'

const { Group } = Radio
export const Option = Radio

export const RadioButton = props => (
  <Parent {...props}>
    {({ onChange, onBlur, value }) => {
      return (
        <Group
          placeholder={props.placeholder}
          id={props.name}
          name={props.name}
          onChange={({ target: { value } }) => onChange(value)}
          onBlur={onBlur}
        >
          {props.children}
        </Group>
      )
    }}
  </Parent>
)

RadioButton.defaultProps = {
  label: '',
  placeholder: '',
  type: 'text'
}

RadioButton.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string
}

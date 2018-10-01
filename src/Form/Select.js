import React from 'react'
import Parent from './Wrapper'
import  AntdSelect  from 'antd/lib/select'
import PropTypes from 'prop-types'

export const { Option } = AntdSelect

export const Select = ({
  children,
  required,
  validations,
  validationError,
  placeholder,
  mode,
  ...rest
}) => (
  <Parent
    required={required}
    validations={validations}
    validationError={validationError}
    {...rest}
  >
    {({ onChange, onBlur, value }) => {
      return (
        <AntdSelect
          defaultValue={rest.defaultValue}
          id={rest.name}
          name={rest.name}
          onChange={value => onChange(value)}
          onBlur={value => onBlur(value)}
          placeholder={placeholder}
          value={value}
          mode={mode ? mode : 'default'}
        >
          {children}
        </AntdSelect>
      )
    }}
  </Parent>
)

Select.defaultProps = {
  label: '',
  placeholder: 'Selecciona una opción'
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  step: PropTypes.number
}

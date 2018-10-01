import React from 'react'
import Parent from './Wrapper'
import DatePicker from 'antd/lib/date-picker'
import PropTypes from 'prop-types'

export const Field = props => (
  <Parent {...props}>
    {({ onChange, onBlur, value }) => {
      return (
        <DatePicker
          value={value}
          // locale={locale}
          placeholder={props.placeholder}
          id={props.name}
          format={props.format}
          name={props.name}
          onChange={onChange}
          onBlur={onBlur}
          className="full-width"
        />
      )
    }}
  </Parent>
)

export default Field

Field.defaultProps = {
  validationError: 'Ingresa una fecha válida',
  placeholder: 'Ingresa una fecha',
  format: 'DD-MM-YYYY'
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
  format: PropTypes.string,
  placeholder: PropTypes.string
}

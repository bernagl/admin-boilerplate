import React from 'react'
import moment from 'moment'
import { message } from 'antd'

export const Header = ({ dates, dias }) => {
  return (
    <div className="week">
      <div className="week-header hidden-sm show-lg">
        {dates.map((e, i) => (
          <div className="row day" key={i}>
            <div className="col-12 day-row">
              <b>{dias[i].name}</b>
              <br />
              <b>{moment(e).format('DD MMMM')}</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Body = ({ clases, dates, dias, eventHandler }) => {
  return (
    <div className="week week-events">
      {dates.map((e, i) => (
        <div className="row day" key={i}>
          <div className="col-12 hidden-lg day-row show-sm">
            <b>{dias[i].name}</b>
            <br />
            <b>{moment(e).format('DD MMMM')}</b>
          </div>
          <div
            className={`col-12 ${moment().format('DD MMMM') ===
              moment(e).format('DD MMMM') && 'today'}`}
          >
            <div className="row">
              {dias[i].events.length > 0 ? (
                dias[i].events.map((ev, j) => {
                  const cola = ev.cupo <= ev.inscritos ? true : false
                  const status = ev.status ? ev.status : 0
                  const future = moment(ev.fin) >= moment() && moment(ev.inicio) > moment() ? true: false
                  return (
                    <div
                      className={`col-12 day-event fade ${status === 2 &&
                        'cancelada'} ${!future && 'disabled'}
                      ${cola && 'full'}`}
                      onClick={() =>
                        status === 2
                          ? message.info('Esta clase fue cancelada')
                          : future
                            ? eventHandler(ev, cola)
                            : message.info('Esta clase ya se venció')
                      }
                      key={j}
                    >
                      <b>{ev.clase.nombre}</b> <br />
                      <span>{ev.instructor.nombre}</span>
                      <br />
                      <span>
                        {moment(ev.inicio).format('LT')} -
                        {moment(ev.fin).format('LT')}
                      </span>
                      <br />
                      <span>Cupo: {ev.cupo}</span>
                      <br />
                      <span>Inscritos: {ev.inscritos_numero ? ev.inscritos_numero : 0}</span>
                      {ev.salon && (
                        <React.Fragment>
                          <br />
                          <span>Salón: {ev.salon.nombre}</span>
                          <br />
                          {/* {clase && <span>{clase.status}</span>} */}
                        </React.Fragment>
                      )}
                    </div>
                  )
                })
              ) : (
                <span
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    width: '100%'
                  }}
                >
                  No hay eventos
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

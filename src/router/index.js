import React from 'react'
import { Route, Switch } from 'react-router-dom'

export default () => {
  return (
    <Switch>
      {/* <Route path="/" exact component={Admin} /> */}
      <Route path="/test" component={Test} />
      <Route component={Error404} />
    </Switch>
  )
}

const Error404 = () => {
  return (
    <div>
      <h5>Error 404 :(</h5>
    </div>
  )
}

const Test = () => {
  return (
    <div>
      <h1>Esto es una prueba</h1>
    </div>
  )
}

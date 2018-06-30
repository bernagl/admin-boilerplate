import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import Model from '../views/Model'

export const Router = () => {
  return (
    <Switch>
      {/* <Route path="/" component={Admin} exact /> */}
      <Route path="/test" component={Test} />
      <Route path="/model/:id" component={Model} />
      <Route component={Ekk} />
    </Switch>
  )
}

const Ekk = () => {
  return (
    <div>
      <Link to="/model/testeando">Hola</Link>
      <h5>Error 404 :(</h5>
    </div>
  )
}

const Test = () => {
  return (
    <div>
      <Link to="/modasfdasf">Hola</Link>
      <h1>Esto es una prueba</h1>
    </div>
  )
}

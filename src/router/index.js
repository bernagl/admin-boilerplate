import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
// import Model from '../views/Model'
import Usuario from '../models/UsuarioModel'
import Clases from '../views/Clases'
import Clase from '../models/ClaseModel'
import Instructor from '../models/InstructorModel'
import Horario from '../models/HorarioModel'
import SalonModel from '../models/SalonModel'
import AsignarCredito from '../models/AsignarCredito'
import Pago from '../models/PagoModel'
import Sucursal from '../models/Sucursal';

export const Router = () => {
  return (
    <Switch>
      {/* <Route path="/" component={Admin} exact /> */}
      <Route path="/calendario" component={Clases} />
      <Route path="/test" component={Test} />
      <Route path="/usuario" component={Usuario} />
      <Route path="/clase" component={Clase} />
      <Route path="/pago" component={Pago} />
      <Route path="/asignar-credito" component={AsignarCredito} />
      <Route path="/instructor" component={Instructor} />
      <Route path="/horario" component={Horario} />
      <Route path="/sucursal" component={Sucursal} />
      {/* <Route path="/model/:id" component={Model} /> */}
      <Route path="/salon" component={SalonModel} />
      {/* <Route path="/sucursal/:id?" component={SucursalForm} /> */}
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

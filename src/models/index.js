import { SucursalForm } from './SucursalModel'
import { InstructorForm } from './InstructorModel'
// import { UsuarioForm } from './UsuarioModel'
// import { SalonForm } from './SalonModel'
import { PagoForm } from './PagoModel'

import { SucursalTable } from './SucursalModel'
// import { UsuarioTable } from './UsuarioModel'

export const Forms = {
  instructor: InstructorForm,
  // usuario: UsuarioForm,
  pago: PagoForm,
  // salon: SalonForm,
  sucursal: SucursalForm
}

export const TableHeaders = {
  sucursal: SucursalTable
  // usuario: UsuarioTable
}

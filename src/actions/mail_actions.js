import axios from 'axios'

export const sendMail = async (users, event, reason) => {
  // const form = new FormData()
  // form.append('reason', reason)
  // form.append('event', JSON.stringify(event))
  // form.append(
  //   'data',
  //   JSON.stringify([
  //     ...users,
  //     { correo: 'luisb.galo@gmail.com', nombre: 'Luis Bernardo Garcia Lopez' }
  //   ])
  // )

  // form.append('type', '__cancel_class__')
  // axios
  //   .post('https://admin.impulsefitness.mx/sendgrid/index.php', form, {
  //     headers: { 'Content-type': 'multipart/form-data' }
  //   })
  //   .then(r => {
  //     console.log(r)
  //     // this.setState({ loading: false, filepath })
  //   })
  //   .catch(e => {
  //     console.log(e)
  //   })
}


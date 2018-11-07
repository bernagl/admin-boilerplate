import axios from 'axios'

export const sendMail = async (users, event, reason) => {
  const form = new FormData()
  form.append('reason', reason)
  form.append('event', JSON.stringify(event))
  form.append(
    'data',
    JSON.stringify([
      ...users,
      { correo: 'luisb.galo@gmail.com', nombre: 'Luis Bernardo Garcia Lopez' }
    ])
  )
  // form.append(
  //   'data',
  //   JSON.stringify([
  //     { correo: 'luisb.galo@gmail.com', nombre: 'Luis Bernardo Garcia Lopez' }
  //   ])
  // )
  form.append('type', '__cancel_class__')
  //localhost:8888/sendgrid/index.php
  axios
    .post('https://admin.impulsefitness.mx/sendgrid/index.php', form, {
      headers: { 'Content-type': 'multipart/form-data' }
    })
    .then(r => {
      console.log(r)
      // this.setState({ loading: false, filepath })
    })
    .catch(e => {
      console.log(e)
    })
}

// export const sendNotification = () => {
//   const data = {
//     personalizations: [{ to: [{ email: 'luisg@mobkii.com' }] }],
//     from: { email: 'test@example.com' },
//     subject: 'Sending with SendGrid is Fun',
//     content: [
//       {
//         type: 'text/plain',
//         value: 'and easy to do anywhere, even with cURL'
//       }
//     ]
//   }
//   return axios
//     .post('https://api.sendgrid.com/v3/mail/send', data, {
//       headers: {
//         Authorization:
//           'Bearer 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',
//         'Content-Type': 'application/json'
//       }
//     })
//     .then(() => console.log('enviado'))
// }

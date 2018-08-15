import axios from 'axios'

import sendGrid from '@sendgrid/mail'

export const sendMail = () => {
  sendGrid.setApiKey(
    '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'
  )
  const msg = {
    to: 'test@example.com',
    from: 'test@example.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  }
  sendGrid.send(msg)
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

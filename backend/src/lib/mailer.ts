import nodemailer from 'nodemailer'

export function createTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    // eslint-disable-next-line no-console
    console.warn('[mail] SMTP env not fully set; emails will not send')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  })
}

export async function sendMail(to: string, subject: string, html: string) {
  const from = process.env.MAIL_FROM || 'no-reply@smart-campus.local'
  const transport = createTransport()
  // eslint-disable-next-line no-console
  console.log('[mail] sending', { to, subject })
  return transport.sendMail({ from, to, subject, html })
}



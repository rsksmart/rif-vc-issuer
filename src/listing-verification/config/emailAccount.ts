export default () => ({
    email: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.RIF_EMAIL_USER,
      password: process.env.RIF_EMAIL_PASSWORD
    }
  });
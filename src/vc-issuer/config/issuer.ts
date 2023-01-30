export default () => ({
    issuer: {
      privateKey: process.env.ISSUER_PRIV_KEY,
      address: process.env.ISSUER_ADDR
    }
  });
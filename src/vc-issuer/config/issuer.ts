
export default () => ({
    issuer: {
      privateKey: process.env.RIF_OWNER_PRIV_KEY,
      address: process.env.RIF_OWNER_ADDR
    }
  });
export default {
  routes: [
    {
      method: 'POST',
      path: '/paypal/create-order', // Quitar /api/ del path
      handler: 'paypal.createOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/paypal/capture-order/:orderId', // Quitar /api/ del path
      handler: 'paypal.captureOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    }
  ]
};
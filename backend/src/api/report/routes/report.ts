module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/reports',
      handler: 'report.create',
    },
    {
      method: 'GET',
      path: '/reports/user',
      handler: 'report.findAllByUser',
    },
    {
      method: 'GET',
      path: '/reports/:id/download',
      handler: 'report.download',
    },
    {
      method: 'DELETE',
      path: '/reports/:id',
      handler: 'report.delete',
    }
  ]
};
export default {
  routes: [
    {
      method: "GET",
      path: "/reports",
      handler: "reports.getReports",
      config: {
        // auth: true => requiere estar autenticado
        policies: [
          "global::is-admin", // una política custom para verificar rol admin
        ],
      },
    },
  ],
};
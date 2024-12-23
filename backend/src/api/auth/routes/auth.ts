export default {
  routes: [
    {
      method: "POST",
      path: "/auth/logout",
      handler: "logout.logout", // logout = nombre del controller, .logout = método
      config: {
        auth: false,
      },
    },
  ],
};
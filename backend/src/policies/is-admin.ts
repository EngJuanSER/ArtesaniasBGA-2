export default async (ctx, config, { strapi }) => {
  const user = ctx.state.user;
  if (!user) {
    return ctx.unauthorized("Debe iniciar sesión");
  }
  // Si el rol en Strapi es 'admin' (o como lo manejes):
  if (user.role.name === "admin") {
    return true; // pasa
  } else {
    return ctx.forbidden("No tiene permisos para ver reportes");
  }
};
import { factories } from "@strapi/strapi";

export default factories.createCoreController("plugin::users-permissions.user", ({ strapi }) => ({
  async logout(ctx) {
    try {
      // Si usas cookie HttpOnly, la forma de "invalidar" es expirarla:
      ctx.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), // fecha pasada
        sameSite: "strict",
        path: "/",
      });

      ctx.send({ message: "Logout exitoso, cookie limpiada" }, 200);
    } catch (err) {
      ctx.badRequest("Error al hacer logout");
    }
  },
}));
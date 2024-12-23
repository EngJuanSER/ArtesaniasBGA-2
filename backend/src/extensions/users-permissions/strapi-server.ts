import type { Strapi } from "@strapi/strapi";

export default (strapi: Strapi) => {
  // Sobrescribes la lógica default del plugin "users-permissions" para login
  // y registras un middleware que cree la cookie.
  const extensionService = strapi.plugin("users-permissions").service("users-permissions");
  
  // Hook que se ejecuta cuando Strapi se inicia
  return {
    async register({ strapi }) {
      // Sobrescribir el controlador de login
      const userController = strapi.plugin("users-permissions").controller("auth");

      userController.login = async (ctx) => {
        try {
          // Llama a la lógica original de login. 
          await extensionService.checkRestrictions(ctx.request.body, "login");
          // Strapi crea un JWT y un objeto user
          const { jwt, user } = await strapi
            .plugin("users-permissions")
            .service("auth")
            .callback("local")(ctx);

          if (!user) {
            return ctx.badRequest("Usuario no encontrado");
          }

          // Configuras la cookie con el JWT
          ctx.cookies.set("token", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 día, ajusta a tu necesidad
            domain: "tudominio.com",     // ajusta tu dominio
            sameSite: "strict",
            path: "/",
          });
          
          // Devuelves la respuesta. 
          // Puedes evitar mandar el jwt al body, si solo usarás la cookie
          ctx.send({
            user,
            message: "Login exitoso con cookie HTTP-only",
          });

        } catch (err) {
          return ctx.badRequest(err.message);
        }
      };

      // Sobrescribir el controlador de register si quieres la misma lógica
      userController.register = async (ctx) => {
        // Lógica similar: crea user, genera jwt, setea cookie
      };
    },
  };
};
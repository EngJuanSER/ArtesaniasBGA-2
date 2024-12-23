import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::reports.reports", ({ strapi }) => ({
  async getReports(ctx) {
    try {
      // Lógica para generar consecha de datos
      // Retorna data de example
      ctx.send({ success: true, data: [/* tu reporte */] });
    } catch (error) {
      ctx.badRequest("No se pudo generar el reporte");
    }
  },
}));
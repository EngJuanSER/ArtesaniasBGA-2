import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const { items, total, paymentID, paymentState, state, shippingAddres } = ctx.request.body.data;

      console.log('Creating order with data:', {
        userId: user.id,
        items,
        total,
        paymentID,
        paymentState,
        state,
        shippingAddres
      });   

      const order = await strapi.entityService.create("api::order.order", {
        data: {
          items,
          total,
          paymentID,
          paymentState,
          state,
          shippingAddres,
          user: user.id,
          slug: `order-${Date.now()}`,
          publishedAt: new Date()
        }
      });

      console.log('Order created successfully:', order);
      return { data: order };
    } catch (error) {
      console.error('Error creating order:', error);
      return ctx.badRequest("Error al crear la orden");
    }
  },
  async findOne(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const { id } = ctx.params;
      const order = await strapi.entityService.findOne("api::order.order", id, {
        populate: ["user"]
      }) as any;

      if (!order || order.user?.id !== user.id) {
        return ctx.unauthorized("No autorizado");
      }

      return { data: order };
    } catch (error) {
      return ctx.badRequest("Error al obtener la orden");
    }
  },
  async delete(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const { id } = ctx.params;
      const order = await strapi.entityService.findOne("api::order.order", id, {
        populate: ["user"]
      }) as any;

      if (!order || order.user?.id !== user.id) {
        return ctx.unauthorized("No autorizado");
      }

      const deletedOrder = await strapi.entityService.delete("api::order.order", id);
      return { data: deletedOrder };
    } catch (error) {
      return ctx.badRequest("Error al eliminar la orden");
    }
  }
}));
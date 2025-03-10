
import { factories } from '@strapi/strapi'

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async create(ctx) {
    try {
      const data = {
        ...ctx.request.body.data,
        publishedAt: new Date()
      };

      console.log('Datos recibidos:', data);

      if (data.stock < 0) {
        return ctx.badRequest("El stock no puede ser negativo");
      }

      if (data.price <= 0) {
        return ctx.badRequest("El precio debe ser mayor a 0");
      }

      const product = await strapi.entityService.create("api::product.product", {
        data,
        populate: ['images', 'category']
      });

      console.log('Producto creado:', product);

      if (product.stock < 10) {
        await strapi.service('api::notification.notification').notifyLowStock(product);
      }

      return { data: product };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body.data;

      if (data.stock !== undefined && data.stock < 0) {
        return ctx.badRequest("El stock no puede ser negativo");
      }

      if (data.price !== undefined && data.price <= 0) {
        return ctx.badRequest("El precio debe ser mayor a 0");
      }

      const product = await strapi.entityService.update("api::product.product", id, {
        data,
        populate: ['images', 'category']
      });

      return { data: product };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
    
      // Buscar producto directamente por ID
      const product = await strapi.db.query('api::product.product').findOne({
        where: { id },
        populate: ['images']
      });
  
      if (!product) {
        return ctx.notFound('Producto no encontrado');
      }
  
    // Eliminar usando el ID
    const deletedProduct = await strapi.entityService.delete('api::product.product', product.id, {
      populate: ['images']
    });
      
      await strapi.service('api::user-action.user-action').create({
        data: {
          type: 'delete_product',
          user: ctx.state.user.id,
          details: {
            productId: product.id,
            productName: product.productName
          }
        }
      });

      return { data: deletedProduct };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  }
}));
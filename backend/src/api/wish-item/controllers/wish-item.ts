"use strict";

import { factories } from '@strapi/strapi'

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::wish-item.wish-item", ({ strapi }) => ({
  async create(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      const { productSlug } = ctx.request.body;
      if (!productSlug) return ctx.badRequest("Producto no especificado");

      // Buscar wishlist del usuario
      let [wishlist] = await strapi.entityService.findMany("api::wishlist.wishlist", {
        filters: { user: user.id },
        populate: ['wishItems.product']
      });

      // Verificar si ya existe el item
      const existingItem = wishlist.wishItems?.find(item => 
        item.product.slug === productSlug
      );

      if (existingItem) {
        return ctx.badRequest("Producto ya está en favoritos");
      }

      // Buscar el producto
      const [product] = await strapi.entityService.findMany("api::product.product", {
        filters: { slug: productSlug }
      });

      if (!product) return ctx.badRequest("Producto no encontrado");

      // Crear wish-item
      const wishItem = await strapi.entityService.create("api::wish-item.wish-item", {
        data: {
          product: product.id,
          wishlist: wishlist.id,
          slug: `wish-item-${Date.now()}`,
          publishedAt: new Date()
        }
      });

      return { data: wishItem };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async delete(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");
  
      const { id } = ctx.params;
      
      const wishItem = await strapi.entityService.findOne("api::wish-item.wish-item", id, {
        populate: {
          wishlist: {
            populate: ['user']
          }
        }
      });
  
      if (!wishItem) {
        return ctx.notFound("Item no encontrado");
      }
  
      if (!wishItem.wishlist?.user?.id || wishItem.wishlist.user.id !== user.id) {
        return ctx.unauthorized("No autorizado para eliminar este item");
      }
  
      await strapi.entityService.delete("api::wish-item.wish-item", wishItem.id);
  
      return { data: null };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return ctx.badRequest(error.message);
    }
  }
}));
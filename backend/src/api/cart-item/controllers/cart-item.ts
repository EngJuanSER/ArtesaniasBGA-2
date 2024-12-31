"use strict";
import {factories} from "@strapi/strapi";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart-item.cart-item", ({ strapi }) => ({
   async update(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");
  
      // El slug viene en la URL como parámetro
      const { id } = ctx.params; // Cambiar a usar el ID de la URL
      const { quantity } = ctx.request.body;
      const quantityNum = parseInt(quantity, 10);
  
      console.log("Buscando CartItem con id:", id);
  
      // Buscar por ID en vez de slug
      const cartItem = await strapi.entityService.findOne("api::cart-item.cart-item", id, {
        populate: {
          cart: {
            populate: ['user']
          },
          product: true
        }
      });
  
      console.log("CartItem encontrado:", cartItem);
  
      if (!cartItem) {
        return ctx.notFound(`CartItem no encontrado`);
      }
  
      // Verificar autorización
      if (!cartItem.cart?.user?.id || cartItem.cart.user.id !== user.id) {
        return ctx.unauthorized("No autorizado para modificar este item");
      }
  
      // Actualizar cantidad
      const updated = await strapi.entityService.update('api::cart-item.cart-item', cartItem.id, {
        data: { quantity: quantityNum },
        populate: {
          cart: {
            populate: {
              cartItems: {
                populate: ['product']
              }
            }
          }
        }
      });
  
      return { data: updated };
    } catch (error) {
      console.error("Error completo:", error);
      return ctx.badRequest(error.message || "Error al actualizar cantidad");
    }
  },
  
  async delete(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");
  
      const { slug } = ctx.params;
      
      console.log("Buscando CartItem para eliminar con slug:", slug);
  
      // Misma corrección en la búsqueda
      const cartItems = await strapi.entityService.findMany("api::cart-item.cart-item", {
        filters: { 
          slug: {
            $eq: slug
          }
        },
        populate: {
          cart: {
            populate: ['user']
          }
        }
      });
  
      const cartItem = cartItems[0];
      console.log("CartItem encontrado para eliminar:", cartItem);
  
      if (!cartItem) {
        return ctx.notFound(`CartItem con slug ${slug} no encontrado`);
      }
  
      if (!cartItem.cart?.user?.id || cartItem.cart.user.id !== user.id) {
        return ctx.unauthorized("No autorizado para eliminar este item");
      }
  
      // Guardar el cartId antes de eliminar
      const cartId = cartItem.cart.id;
  
      await strapi.entityService.delete("api::cart-item.cart-item", cartItem.id);
  
      // Obtener carrito actualizado
      const updatedCart = await strapi.entityService.findOne("api::cart.cart", cartId, {
        populate: {
          cartItems: {
            populate: ['product']
          }
        }
      });
  
      return { data: updatedCart };
    } catch (error) {
      console.error("Error completo al eliminar:", error);
      return ctx.badRequest(error.message || "Error al eliminar item");
    }
  }
}));
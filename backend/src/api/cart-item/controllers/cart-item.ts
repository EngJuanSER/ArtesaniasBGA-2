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
    
      // Buscar por ID en vez de slug
      const cartItem = await strapi.entityService.findOne("api::cart-item.cart-item", id, {
        populate: {
          cart: {
            populate: {
              cartItems: {
                populate: ['product']
              },
              user: true
            }
          },
          product: true
        }
      });
    
      if (!cartItem) {
        return ctx.notFound(`CartItem no encontrado`);
      }
  
      // Verificar autorización
      if (!cartItem.cart?.user?.id || cartItem.cart.user.id !== user.id) {
        return ctx.unauthorized("No autorizado para modificar este item");
      }
  
      // Actualizar cantidad del cartItem
      await strapi.entityService.update('api::cart-item.cart-item', cartItem.id, {
        data: { quantity: quantityNum }
      });

      const updatedCart = await strapi.entityService.findOne('api::cart.cart', cartItem.cart.id, {
        populate: {
          cartItems: {
            populate: ['product']
          }
        }
      });

      const total = updatedCart.cartItems.reduce((sum: number, item: any) => {
        const price = Number(item.product.offer ? item.product.priceOffer : item.product.price);
        const qty = Number(item.quantity);
        return sum + (price * qty);
      }, 0);
  
      const finalCart = await strapi.entityService.update('api::cart.cart', cartItem.cart.id, {
        data: { 
          total: Number(total.toFixed(2))
        },
        populate: {
          cartItems: {
            populate: ['product']
          }
        }
      });

      return { data: finalCart };
    } catch (error) {
      console.error("Error completo:", error);
      return ctx.badRequest(error.message || "Error al actualizar cantidad");
    }
  },
  
  async delete(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");
  
      const { id } = ctx.params;
        
      const cartItem = await strapi.entityService.findOne("api::cart-item.cart-item", id, {
        populate: {
          cart: {
            populate: ['user']
          }
        }
      });
    
      if (!cartItem) {
        return ctx.notFound(`CartItem no encontrado`);
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
"use strict";
import { factories } from "@strapi/strapi";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart-item.cart-item", ({ strapi }) => ({
  async update(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No user found");

      const cartItemId = ctx.params.id;
      const { quantity } = ctx.request.body;

      if (!quantity || quantity < 1) return ctx.badRequest("Cantidad inválida");

      // Obtener cartItem
      const cartItem = await strapi.entityService.findOne("api::cart-item.cart-item", cartItemId, {
        populate: { product: true, cart: { populate: { user: true, cartItems: { populate: { product: true } } } } }
      });

      if (!cartItem) return ctx.badRequest("Cart item no encontrado");

      // Verificar si el cartItem pertenece al usuario
      if (cartItem.cart.user.id !== user.id) {
        return ctx.unauthorized("No autorizado");
      }

      // Actualizar cantidad
      await strapi.entityService.update("api::cart-item.cart-item", cartItemId, {
        data: { quantity },
        populate: { product: true }
      });

      // Recalcular el total del carrito
      const cart = await strapi.entityService.findOne("api::cart.cart", cartItem.cart.id, {
        populate: { cartItems: { populate: { product: true } } }
      });

      let sum = 0;
      for (const item of cart.cartItems) {
        const p = item.product;
        if (p.offer && p.priceOffer) {
          sum += Number(p.priceOffer) * item.quantity;
        } else {
          sum += Number(p.price) * item.quantity;
        }
      }

      // Actualizar el total en el carrito
      await strapi.entityService.update("api::cart.cart", cart.id, {
        data: { total: sum }
      });

      // Obtener el carrito actualizado
      const updatedCart = await strapi.entityService.findOne("api::cart.cart", cart.id, {
        populate: { cartItems: { populate: { product: true } } }
      });

      return { data: updatedCart };
    } catch (error) {
      console.error("Error actualizando cantidad del CartItem:", error);
      return ctx.badRequest("Error actualizando la cantidad");
    }
  }
}));
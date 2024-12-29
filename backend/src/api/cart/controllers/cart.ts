"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart.cart", ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("No user found");

    let [cart] = await strapi.entityService.findMany("api::cart.cart", {
      filters: { user: user.id },
      populate: { cartItems: { populate: { product: true } } }
    });

    if (!cart) {
      cart = await strapi.entityService.create("api::cart.cart", {
        data: {
          user: user.id,
          total: 0,
          bought: false,
          publishedAt: new Date(),
          cartItems: []
        },
        populate: { cartItems: { populate: { product: true } } }
      });
    }

    return { data: cart };
  },

  async create(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No user found");

      const { slug, quantity } = ctx.request.body;
      if (!slug) return ctx.badRequest("Product slug required");

      // Buscar producto por slug
      const [product] = await strapi.entityService.findMany(
        "api::product.product",
        {
          filters: { slug },
          populate: {}
        }
      );
      if (!product) return ctx.badRequest("Producto no encontrado");

      const qty = quantity ? parseInt(quantity, 10) : 1;
      if (qty < 1) return ctx.badRequest("Cantidad inválida");

      // Buscar o crear carrito
      let [cart] = await strapi.entityService.findMany("api::cart.cart", {
        filters: { user: user.id },
        populate: { cartItems: { populate: { product: true } } }
      });

      if (!cart) {
        // Crear carrito con el primer CartItem
        cart = await strapi.entityService.create("api::cart.cart", {
          data: {
            user: user.id,
            total: 0,
            bought: false,
            publishedAt: new Date(),
            cartItems: [
              {
                product: product.id,
                quantity: qty
              }
            ]
          },
          populate: { cartItems: { populate: { product: true } } }
        });
      } else {
        cart = cart[0];
        // Verificar si el producto ya está en el carrito
        const existingCartItem = cart.cartItems.find(
          (item) => item.product.id === product.id
        );

        if (existingCartItem) {
          // Actualizar la cantidad del CartItem existente
          await strapi.entityService.update("api::cart-item.cart-item", existingCartItem.id, {
            data: {
              quantity: existingCartItem.quantity + qty
            },
            populate: { product: true }
          });
        } else {
          // Crear un nuevo CartItem
          await strapi.entityService.create("api::cart-item.cart-item", {
            data: {
              cart: cart.id,
              product: product.id,
              quantity: qty
            },
            populate: { product: true }
          });
        }

        // Recalcular el total del carrito
        const updatedCart = await strapi.entityService.findOne("api::cart.cart", cart.id, {
          populate: { cartItems: { populate: { product: true } } }
        });

        let sum = 0;
        for (const item of updatedCart.cartItems) {
          const p = item.product;
          if (p.offer && p.priceOffer) {
            sum += Number(p.priceOffer) * item.quantity;
          } else {
            sum += Number(p.price) * item.quantity;
          }
        }

        // Actualizar el total en el carrito
        await strapi.entityService.update("api::cart.cart", cart.id, {
          data: { total: sum },
          populate: { cartItems: { populate: { product: true } } }
        });

        // Obtener el carrito actualizado
        cart = await strapi.entityService.findOne("api::cart.cart", cart.id, {
          populate: { cartItems: { populate: { product: true } } }
        });
      }

      return { data: cart };
    } catch (error) {
      console.error("Error añadiendo producto por slug:", error);
      return ctx.badRequest("Error añadiendo producto al carrito");
    }
  }
}));
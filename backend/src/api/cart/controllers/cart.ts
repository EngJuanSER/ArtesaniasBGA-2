"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart.cart", ({ strapi }) => ({
  async find(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Usuario no autenticado");

      let [cart] = await strapi.entityService.findMany("api::cart.cart", {
        filters: { user: user.id, bought: false },
        populate: { 
          user: true,
          cartItems: { 
            populate: { 
              product: {
                populate: ['images']
              } 
            } 
          } 
        }
      });

      if (!cart) {
        cart = await strapi.entityService.create("api::cart.cart", {
          data: {
            user: user.id,
            total: 0,
            bought: false,
            publishedAt: new Date()
          },
          populate: { 
            cartItems: { 
              populate: { 
                product: {
                  populate: ['images']
                } 
              } 
            } 
          }
        });
      }

      return { data: cart };
    } catch (error) {
      ctx.throw(500, "Error al obtener el carrito");
    }
  },

  async create(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Usuario no autenticado");

      const { slug, quantity = 1 } = ctx.request.body;
      const quantityNum = parseInt(quantity, 10);

      if (isNaN(quantityNum) || quantityNum < 1) {
        return ctx.badRequest("Cantidad inválida");
      }

      if (quantityNum > 999) {
        return ctx.badRequest("Cantidad máxima permitida es 999");
      }

      // Verificar producto
      const [product] = await strapi.entityService.findMany("api::product.product", {
        filters: { slug },
        populate: ['images']
      });

      if (!product) return ctx.notFound("Producto no encontrado");
      if (product.stock < quantityNum) return ctx.badRequest("Stock insuficiente");

      // Buscar carrito activo
      let [cart] = await strapi.entityService.findMany("api::cart.cart", {
        filters: { 
          user: user.id, 
          bought: false
        },
        populate: { 
          cartItems: { 
            populate: { 
              product: {
                populate: ['images']
              } 
            } 
          } 
        }
      });

      if (!cart) {
        cart = await strapi.entityService.create("api::cart.cart", {
          data: {
            user: user.id,
            total: 0,
            bought: false,
            publishedAt: new Date()
          },
          populate: { 
            cartItems: { 
              populate: { 
                product: {
                  populate: ['images']
                } 
              } 
            } 
          }
        });
      }

      // Verificar si el producto ya está en el carrito
      const existingItem = cart.cartItems?.find(item => 
        item.product.slug === slug
      );

      if (existingItem) {
        return ctx.badRequest("Este producto ya está en el carrito");
      }

      // Crear nuevo CartItem
      await strapi.entityService.create("api::cart-item.cart-item", {
        data: {
          product: product.id,
          quantity: quantityNum,
          cart: cart.id,
          slug: `cart-item-${Date.now()}`, 
          publishedAt: new Date()
        }
      });

      // Obtener carrito actualizado
      const updatedCart = await strapi.entityService.findOne("api::cart.cart", cart.id, {
        populate: { 
          cartItems: { 
            populate: { 
              product: {
                populate: ['images']
              } 
            } 
          } 
        }
      });

      // Calcular nuevo total
      const total = updatedCart.cartItems.reduce((sum, item) => {
        const price = Number(item.product.offer ? item.product.priceOffer : item.product.price);
        const qty = Number(item.quantity);
        return sum + (price * qty);
      }, 0);

      // Validar total
      if (total > Number.MAX_SAFE_INTEGER) {
        return ctx.badRequest("Total excede límite permitido");
      }

      // Actualizar total del carrito
      const finalCart = await strapi.entityService.update("api::cart.cart", cart.id, {
        data: { 
          total: Number(total.toFixed(2))
        },
        populate: { 
          cartItems: { 
            populate: { 
              product: {
                populate: ['images']
              } 
            } 
          } 
        }
      });

      return { data: finalCart };
    } catch (error) {
      strapi.log.error("Error adding product to cart:", error);
      return ctx.badRequest("No se pudo procesar la solicitud");
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { quantity } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) return ctx.unauthorized("Usuario no autenticado");

      const quantityNum = parseInt(quantity, 10);
      
      if (isNaN(quantityNum) || quantityNum < 1) {
        return ctx.badRequest("Cantidad inválida");
      }

      if (quantityNum > 999) {
        return ctx.badRequest("Cantidad máxima permitida es 999");
      }

      const cartItem = await strapi.entityService.findOne("api::cart-item.cart-item", id, {
        populate: { 
          product: true,
          cart: {
            populate: ['user']
          }
        }
      });

      if (!cartItem) return ctx.notFound("Item no encontrado");
      if (cartItem.cart.user.id !== user.id) return ctx.unauthorized("No autorizado");
      if (cartItem.product.stock < quantityNum) return ctx.badRequest("Stock insuficiente");

      // Actualizar cantidad
      await strapi.entityService.update("api::cart-item.cart-item", id, {
        data: { quantity: quantityNum }
      });

      // Obtener carrito actualizado
      const [cart] = await strapi.entityService.findMany("api::cart.cart", {
        filters: { user: user.id, bought: false },
        populate: { 
          cartItems: { 
            populate: { 
              product: {
                populate: ['images']
              } 
            } 
          } 
        }
      });

      // Calcular nuevo total
      const total = cart.cartItems.reduce((sum, item) => {
        const price = Number(item.product.offer ? item.product.priceOffer : item.product.price);
        const qty = Number(item.quantity);
        return sum + (price * qty);
      }, 0);

      if (total > Number.MAX_SAFE_INTEGER) {
        return ctx.badRequest("Total excede límite permitido");
      }

      const updatedCart = await strapi.entityService.update("api::cart.cart", cart.id, {
        data: { 
          total: Number(total.toFixed(2))
        },
        populate: { 
          cartItems: { 
            populate: { 
              product: {
                populate: ['images']
              } 
            } 
          } 
        }
      });

      return { data: updatedCart };
    } catch (error) {
      strapi.log.error("Error updating cart:", error);
      return ctx.badRequest("No se pudo actualizar el carrito");
    }
  }
}));
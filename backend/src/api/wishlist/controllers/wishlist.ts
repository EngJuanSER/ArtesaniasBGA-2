
import { factories } from '@strapi/strapi'

"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::wishlist.wishlist", ({ strapi }) => ({
  async find(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("No autorizado");

      let [wishlist] = await strapi.entityService.findMany("api::wishlist.wishlist", {
        filters: { user: user.id },
        populate: {
          wishItems: {
            populate: {
              product: {
                populate: ['images']
              }
            }
          }
        }
      });

      if (!wishlist) {
        wishlist = await strapi.entityService.create("api::wishlist.wishlist", {
          data: {
            user: user.id,
            slug: `wishlist-${Date.now()}`,
            publishedAt: new Date()
          }
        });
      }

      return { data: wishlist };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  }
}));
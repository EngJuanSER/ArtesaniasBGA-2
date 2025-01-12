module.exports = () => {
  return async (ctx, next) => {
    await next(); // Ejecutar la solicitud primero

    if (!ctx.state.user) return; // Solo rastrear usuarios autenticados

    try {
      const { method, path } = ctx.request;
      let actionType, productId, details;

      // Capturar vista de producto
      if (method === 'GET' && path.match(/^\/api\/products\/[^\/]+$/)) {
        actionType = 'view_product';
        productId = ctx.params.id;
        details = {
          timestamp: new Date(),
          referrer: ctx.request.headers.referer,
          userAgent: ctx.request.headers['user-agent']
        };
      }
      // Capturar agregado al carrito
      else if (method === 'POST' && path === '/api/cart-items') {
        actionType = 'add_to_cart';
        productId = ctx.request.body.product;
        details = { quantity: ctx.request.body.quantity };
      }
      // Capturar búsqueda
      else if (method === 'GET' && path === '/api/products' && ctx.query.q) {
        actionType = 'search';
        details = {
          query: ctx.query.q,
          filters: ctx.query,
          resultsCount: ctx.response.body?.data?.length || 0,
          timestamp: new Date()
        };
      }
      // Capturar compra
      else if (method === 'POST' && path === '/api/orders') {
        actionType = 'purchase';
        details = {
          orderId: ctx.response.body?.data?.id,
          total: ctx.request.body?.total
        };
      }

      // Capturar eliminación del carrito
      else if (method === 'DELETE' && path.match(/^\/api\/cart-items\/[^\/]+$/)) {
        actionType = 'remove_from_cart';
        details = {
          cartItemId: ctx.params.id,
          timestamp: new Date()
        };
        
        try {
          const cartItem = await strapi.entityService.findOne('api::cart-item.cart-item', ctx.params.id, {
            populate: {
              product: true
            }
          }) as any; // Usar type assertion temporalmente
          
          if (cartItem?.product?.id) {
            productId = cartItem.product.id;
            details.productName = cartItem.product.productName;
          }
        } catch (error) {
          strapi.log.error('Error getting cart item details:', error);
        }
      }
      
      // Capturar uso de filtros (sin búsqueda)
      else if (method === 'GET' && path === '/api/products' && Object.keys(ctx.query).length > 0 && !ctx.query.q) {
        actionType = 'filter_use';
        details = {
          filters: ctx.query,
          resultsCount: ctx.response.body?.data?.length || 0,
          timestamp: new Date()
        };
      }

      // Capturar agregar a wishlist
      else if (method === 'POST' && path === '/api/wish-items') {
        actionType = 'add_to_whislist';
        productId = ctx.request.body.product;
        details = {
          timestamp: new Date()
        };
      }


      if (actionType) {
        await strapi.entityService.create('api::user-action.user-action', {
          data: {
            type: actionType,
            user: ctx.state.user.id,
            product: productId,
            details,
            timestamp: new Date(),
            publishedAt: new Date()
          }
        });
      }
    } catch (error) {
      strapi.log.error('Error tracking user action:', error);
    }
  };
};
import { factories } from '@strapi/strapi';


async function getPayPalAccessToken() {
  const creds = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
  
  const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!tokenRes.ok) {
    const errData = await tokenRes.json().catch(() => ({}));
    throw new Error(`Error obteniendo token de PayPal: ${JSON.stringify(errData)}`);
  }

  const json = await tokenRes.json() as { access_token: string };
  return json.access_token as string;
}

export default {
  async createOrder(ctx) {
    try {
      const { items, total } = ctx.request.body;
      const accessToken = await getPayPalAccessToken();

      const itemTotal = items.reduce((sum: number, item: any) => {
        return sum + (Number(item.unit_amount.value) * Number(item.quantity));
      }, 0);

      const response = await fetch(
        'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            application_context: {
              return_url: process.env.FRONTEND_URL || 'http://localhost:3000',
              cancel_url: process.env.FRONTEND_URL || 'http://localhost:3000',
              brand_name: 'ArtesaníasBGA',
              landing_page: 'LOGIN',
              user_action: 'PAY_NOW',
              payment_method: {
                payee_preferred: 'UNRESTRICTED',
              },
            },
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: total.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: 'USD',
                      value: itemTotal.toFixed(2),
                    },
                  },
                },
                items: items.map((item) => ({
                  name: item.name,
                  unit_amount: {
                    currency_code: 'USD',
                    value: item.unit_amount.value,
                  },
                  quantity: item.quantity,
                  category: item.category,
                })),
              },
            ],
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        return ctx.throw(response.status, data);
      }
      return data;
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  
  async captureOrder(ctx) {
    try {
      const { orderId } = ctx.params;
      const accessToken = await getPayPalAccessToken();

      const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });

      // Evitar error de JSON vacío
      const textResult = await response.text();
      let data;
      try {
        data = JSON.parse(textResult);
      } catch {
        data = {};
      }

      console.log('PayPal capture response:', data);

      if (!response.ok) {
        console.error('PayPal capture error:', data);
        return ctx.throw(response.status, data);
      }

      return data;
    } catch (error) {
      console.error('PayPal capture error:', error);
      ctx.throw(500, error);
    }
  }
};
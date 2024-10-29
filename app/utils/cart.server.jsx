const shop = "starting-to-build-app.myshopify.com"; // ShopifyストアのURL

// ShopifyのstorefrontAPIを使って商品をカートに追加する関数
export async function addToCart(variantId, quantity) {
  const query = `
    mutation {
      cartCreate(input: {
        lines: [
          {
            quantity: ${quantity}, 
            merchandiseId: "${variantId}"
          }
        ]
      }) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
                quantity
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '7adaae2cec2eb33dc8ee9f73f3d2f6ea',
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error('Errors:', result.errors);
    return null;
  }

  if (result.data) {
    console.log('Cart:', result.data.cartCreate.cart);
    return result.data.cartCreate.cart;
  } else {
    console.error('Failed to add to cart');
    return null;
  }
}

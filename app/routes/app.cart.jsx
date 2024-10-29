// app/routes/app.cart.jsx
import { json, redirect } from "@remix-run/node"; // json, redirectをインポート
import { authenticate, unauthenticated } from "../shopify.server";

const shop = "starting-to-build-app.myshopify.com";
const variantId = "gid://shopify/ProductVariant/49337863438647";
const quantity = 1;
const { storefront } = await unauthenticated.storefront(shop);
// ローダー関数
export async function loader({ request }) {
  // 必要に応じて、リクエストからクエリパラメータを取得することができます
  //const url = new URL(request.url);
  //const variantId = url.searchParams.get("variantId"); // クエリパラメータからvariantIdを取得
 // const quantity = parseInt(url.searchParams.get("quantity"), 10) || 1; // quantityを取得、デフォルトは1

  // カートに商品を追加
  const cart = await addToCart(variantId, quantity);

  // カートの情報をJSON形式で返す
  return json(cart);
}

// ShopifyのstorefrontAPIを使って商品をカートに追加する関数
async function addToCart(variantId, quantity) {
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
      'X-Shopify-Storefront-Access-Token': '7adaae2cec2eb33dc8ee9f73f3d2f6ea', // あなたのアクセストークン
    },
    body: JSON.stringify({ query }),
  });
  
  const result = await response.json();
  
  // エラーが発生した場合の処理
  if (result.errors) {
    console.error('Errors:', result.errors);
    return null; // エラーがあった場合はnullを返す
  }
  
  // カートに商品が追加された場合の処理
  if (result.data) {
    console.log('Cart:', result.data.cartCreate.cart);
    return result.data.cartCreate.cart; // カート情報を返す
  } else {
    console.error('Failed to add to cart');
    return null;
  }
}

// カート追加後にリダイレクトする場合は、例えば以下のように使うことができます
export async function action({ request }) {
  const formData = new URLSearchParams(await request.text());
  const variantId = formData.get("variantId");
  const quantity = parseInt(formData.get("quantity"), 10) || 1;

  const cart = await addToCart(variantId, quantity);
  
  if (cart) {
    // カートが正常に作成された場合、カートページにリダイレクト
    return redirect(`https://${shop}/cart`);
  } else {
    // エラーが発生した場合、エラーページなどにリダイレクト
    return redirect("/error"); // エラーページのURLを指定
  }
}

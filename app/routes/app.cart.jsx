// app/routes/app.cart.jsx
import { json, redirect } from "@remix-run/node";
import { addToCart } from "../utils/cart.server"; // カート操作のユーティリティ関数をインポート

const shop = "starting-to-build-app.myshopify.com";

// カートに商品を追加するローダー
export async function loader({ request }) {
  const variantId = "gid://shopify/ProductVariant/49337863438647";
  const quantity = 1;

  const cart = await addToCart(variantId, quantity);
  return json(cart);
}

// カート追加のアクション
export async function action({ request }) {
  const formData = new URLSearchParams(await request.text());
  const variantId = formData.get("variantId");
  const quantity = parseInt(formData.get("quantity"), 10) || 1;

  const cart = await addToCart(variantId, quantity);

  if (cart) {
    return redirect(`https://${shop}/cart`);
  } else {
    return redirect("/error");
  }
}

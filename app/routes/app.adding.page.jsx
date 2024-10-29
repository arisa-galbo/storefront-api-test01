// app/routes/app.adding.page.jsx
import { json, redirect } from "@remix-run/node";
import { addToCart } from "../utils/cart.server"; // カート操作のユーティリティ関数をインポート
import { Form } from "@remix-run/react";

const shop = "starting-to-build-app.myshopify.com";

// カート追加のアクション
export async function action({ request }) {
  const formData = new URLSearchParams(await request.text());
  const variantId = "gid://shopify/ProductVariant/49337863438647"
  const quantity = parseInt(formData.get("quantity"), 10) || 1;

  const cart = await addToCart(variantId, quantity);

  if (cart) {
    return redirect(`https://${shop}/cart`);
  } else {
    return redirect("/error");
  }
}

// ページコンポーネント
export default function AddingPage() {
  const variantId = "gid://shopify/ProductVariant/49337863438647"; // 追加する商品のVariant ID

  return (
    <div>
      <h1>商品をカートに追加するページ</h1>
      <Form method="post" action="/app/adding.page">
        <input type="hidden" name="variantId" value={variantId} />
        <input type="number" name="quantity" defaultValue="1" min="1" />
        <button type="submit">カートに追加</button>
      </Form>
    </div>
  );
}

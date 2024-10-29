// app/routes/app.cart.jsx
import { json, redirect } from "@remix-run/node";
import { addToCart } from "../utils/cart.server"; // カート操作のユーティリティ関数をインポート

const shop = "starting-to-build-app.myshopify.com";

// カートに商品を追加するローダー
export async function loader({ request }) {
    const url = new URL(request.url);
    //const variantId = url.searchParams.get("variantId"); // クエリからvariantIdを取得
    const variantId = "gid://shopify/ProductVariant/49337863438647";
    const quantity = url.searchParams.get("quantity") || 1;
  
    // クエリパラメータが存在する場合に処理を実行
    if (variantId) {
      const cart = await addToCart(variantId, quantity);
      return redirect(`https://${shop}/cart`);
    } else {
        return redirect("/error");
    }
  }


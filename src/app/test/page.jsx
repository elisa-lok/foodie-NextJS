"use client";

import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import LoginModal from "@/components/LoginModal";

export default function testPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page</p>
      <Cart />
      <Checkout />
      <LoginModal />
    </div>
  );
}

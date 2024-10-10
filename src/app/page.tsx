"use client"; // Mark this as a client component

import Meals from '@/components/Meals';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import ActivatePage from '@/app/activate/page';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Meals />
      <Cart />
      <Checkout />
      <LoginModal />
      <RegisterModal />
      <ActivatePage />
    </main>
  );
}

"use client"; // Mark this as a client component

import Meals from '@/components/Meals';
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Meals />
    </main>
    </>
  );
}

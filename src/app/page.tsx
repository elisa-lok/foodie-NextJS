"use client"; // Mark this as a client component

import Meals from '@/components/Meals';

export default function Home() {
  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Meals />
    </main>
    </>
  );
}

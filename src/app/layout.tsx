'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import store from '@/app/store/index';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
        {!pathname.includes('admin') && <Header />}
          {children}
          <div id="modal"></div>
        </Provider>
      </body>
    </html>
  );
}

'use client';

import { Inter } from "next/font/google";
import Header from '@/components/Header';
import "./globals.css";
import { Provider } from 'react-redux';
import store from '@/app/store/index';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <Header />
          {children}
          <div id="modal"></div>
        </Provider>
      </body>
    </html>
  );
}

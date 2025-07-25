// Местоположение: src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { fontHeading, fontBody, fontMono } from './fonts';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Kyanchir',
  description: 'Создан с помощью Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Header />
        {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ: Добавляем overflow-x-hidden к main --- */}
        <main className="flex-grow overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

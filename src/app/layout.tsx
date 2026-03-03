import type { Metadata } from 'next';
import './globals.css';
import { env } from '@/config/env';
import localFont from 'next/font/local';
import { Header } from '@/components/organisms/Header';

const neueMonteral = localFont({
  src: '../../public/Neue Montreal/NeueMontreal-Regular.otf',
  variable: '--font-neue-monteral',
});

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${neueMonteral.variable} `}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

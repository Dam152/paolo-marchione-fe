import type { Metadata } from 'next';
import './globals.css';
import { env } from '@/config/env';
import localFont from 'next/font/local';
import { Header } from '@/components/organisms/Header';
import { FullscreenGlobalResize } from '@/components/FullScreenGlobalResize';
import { createClient } from '@/prismicio';

const neueMonteral = localFont({
  src: '../../public/Neue Montreal/NeueMontreal-Regular.otf',
  variable: '--font-neue-monteral',
  display: 'swap',
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle('settings');

  return {
    title: settings.data.meta_title || env.NEXT_PUBLIC_APP_NAME,
    description: settings.data.meta_description || '',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();
  const settings = await client.getSingle('settings');
  return (
    <html lang={settings.lang} className={`${neueMonteral.variable} `}>
      <body>
        <Header />
        <main>{children}</main>
        <FullscreenGlobalResize />
      </body>
    </html>
  );
}

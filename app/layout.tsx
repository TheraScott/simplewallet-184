import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { BottomNav } from '@/components/layout/bottom-nav';
import { appConfig } from '@/lib/app-config';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: `${appConfig.appName} | Base Mini App`,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {appConfig.baseAppMeta ? (
          <meta name="base:app_id" content={appConfig.baseAppMeta} />
        ) : null}
        {appConfig.verificationMeta ? (
          <meta
            name="talentapp:project_verification"
            content={appConfig.verificationMeta}
          />
        ) : null}
      </head>
      <body className={`${manrope.variable} ${fraunces.variable}`}>
        <Providers>
          <div className="mx-auto min-h-screen max-w-[430px] px-4 pb-28 pt-5">
            {children}
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}

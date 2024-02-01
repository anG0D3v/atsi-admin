import React from 'react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import auth from './api/auth/[...nextauth]/auth';
import { AuthProvider, QueryProvider } from './providers';
import './styles/main.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ATSI - Admin',
  description: 'Developed By: Seamless Software Solutions',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(auth);
  return (
    <html lang="en">
       <link rel="icon" type="image/png" href="assets/logo.png" sizes="32x32" />
      <body className={clsx(inter.className, 'bg-[#F9E79F]')}>
        <AuthProvider session={session}>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

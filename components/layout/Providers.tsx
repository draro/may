'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './ThemeProvider';
import ThemeStyleInjector from './ThemeStyleInjector';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ThemeStyleInjector />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

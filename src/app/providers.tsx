'use client';

import { ProjectProvider } from '@/lib/store';
import React from 'react';
import { FirebaseClientProvider } from '@/firebase';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <ProjectProvider>{children}</ProjectProvider>
    </FirebaseClientProvider>
  );
}

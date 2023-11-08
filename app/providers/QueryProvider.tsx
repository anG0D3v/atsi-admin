'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IQueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider(props: IQueryProviderProps) {
  const [client] = useState(new QueryClient());
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
}

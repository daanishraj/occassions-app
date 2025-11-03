import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';

// Create a test query client with default options for testing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom render function that includes React Query Provider
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
) => {
  const queryClient = options?.queryClient || createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };


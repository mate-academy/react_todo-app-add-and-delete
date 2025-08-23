/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TodoApp } from './components/TodoApp';

const USER_ID = 3334;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

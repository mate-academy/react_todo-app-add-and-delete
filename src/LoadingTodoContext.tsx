import React from 'react';

type LoadingTodoContextValue = {
  isLoading: boolean;
  todoId: number;
};

export const LoadingTodoContext = React.createContext<LoadingTodoContextValue>({
  isLoading: false,
  todoId: 0,
});

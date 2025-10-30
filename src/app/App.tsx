import React from 'react';

import {
  TodoInput,
  TodoList,
  ErrorNotification,
  TodoFilters,
  NotificationProvider,
  TodosProvider,
  FocusProvider,
} from '../features/todos';

export const AppBody: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoInput />
        <TodoList />
        <TodoFilters />
      </div>
      <ErrorNotification />
    </div>
  );
};

export const App: React.FC = () => (
  <NotificationProvider>
    <TodosProvider>
      <FocusProvider>
        <AppBody />
      </FocusProvider>
    </TodosProvider>
  </NotificationProvider>
);

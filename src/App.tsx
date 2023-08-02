import React from 'react';
import { UserWarning } from './UserWarning';
import { AddTodoFormHeader } from './components/AddTodoFormHeader';
import { TodoListSection } from './components/TodoListSection';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotifications } from './components/ErrorNotifications';
import { TodoProvider } from './context/todoContext';

const USER_ID = 11238;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <AddTodoFormHeader />
          <TodoListSection />
          <TodoFooter />
        </div>

        <ErrorNotifications />
      </div>
    </TodoProvider>
  );
};

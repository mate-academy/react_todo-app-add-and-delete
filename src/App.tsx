import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Header } from './components/Header/Header';
import { TodoListItem } from './components/TodoListItem/TodoListItem';
import { ErrorInfo } from './components/ErrorInfo/ErrorInfo';
import { useTodoContext } from './utils/hooks/useTodoContext';

export const App: React.FC = () => {
  const { todos } = useTodoContext();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        <TodoListItem />
        {todos.length > 0 && <TodoFilter />}
      </div>
      <ErrorInfo />
    </div>
  );
};

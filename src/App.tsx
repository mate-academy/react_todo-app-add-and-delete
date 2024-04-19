import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './component/TodoList';
import { TodoFooter } from './component/TodoFooter';
import { TodosContext } from './TodosProvider/TodosProvider';
import { TodoHeader } from './component/TodoHeader';
import { TodoError } from './component/TodoError';

export const App: React.FC = () => {
  const { todos } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoHeader />
        </header>

        {todos.length > 0 && <TodoList />}

        {todos.length > 0 && <TodoFooter />}
      </div>
      <TodoError />
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoError, TodoFooter, TodoList } from './components';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './utils/ErrorMessage';
import { SetErrorContext } from './utils/setErrorContext';

const USER_ID = 10624;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteringMode, setFilteringMode] = useState('all');
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.NoError);
  const [todosToBeDeleted, setTodosToBeDeleted]
  = useState<Todo['id'][] | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => setTodos(response))
      .catch(() => setError(ErrorMessage.CantFetch));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <SetErrorContext.Provider value={setError}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoList
            todos={todos}
            filteringMode={filteringMode}
            userId={USER_ID}
            setTodos={setTodos}
            todosToBeDeleted={todosToBeDeleted}
            setTodosToBeDeleted={setTodosToBeDeleted}
          />
          {/* handle rendering the todo list and the todo entry field */}

          {/* Hide the footer if there are no todos */}
          {todos.length !== 0 && (
            <TodoFooter
              setFilteringMode={setFilteringMode}
              filteringMode={filteringMode}
              todos={todos}
              setTodos={setTodos}
              setTodosToBeDeleted={setTodosToBeDeleted}
            />
          )}
        </div>

        {/* Notification is shown in case of any error */}
        {/* Add the 'hidden' class to hide the message smoothly */}
        {error && <TodoError error={error} />}
      </div>
    </SetErrorContext.Provider>
  );
};

export { ErrorMessage };

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { LoadError } from './types/LoadError';
import { FilterType } from './Enums/FilterType';
import { filterTodos } from './utils/filterTodos';

const USER_ID = 10895;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [loadError, setLoadError] = useState<LoadError>({
    status: false,
    message: '',
  });
  const preparedTodos = filterTodos(todos, filterType);

  const isTodosExists = todos.length > 0;

  const fetchTodos = useCallback(async () => {
    try {
      const responce = await getTodos(USER_ID);

      setTodos(responce);
    } catch (error) {
      setLoadError({
        status: true,
        message: 'Unable to load a todos, retry later',
      });
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {isTodosExists && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          {/* Add a todo on form submit */}
          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {isTodosExists && <TodoList todos={preparedTodos} />}

        {isTodosExists && (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
      </div>

      <ErrorNotification
        loadError={loadError}
        setLoadError={setLoadError}
      />
    </div>
  );
};

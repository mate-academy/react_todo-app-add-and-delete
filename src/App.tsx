/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classnames from 'classnames';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';
import { FilterType } from './types/FilterStatus';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [error, setError] = useState(false);
  const [errorText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  let userId = 0;

  if (user?.id) {
    userId = user?.id;
  }

  getTodos(userId)
    .then(setTodos)
    .catch(() => setError(false));

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return null;
    }
  });

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classnames(
                'todoapp__toggle-all',
                { active: !todos.find(todo => !todo.completed) },
              )}
            />
          )}

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodosList todos={filteredTodos} />

            <Footer
              filterType={filterType}
              handleFilterType={setFilterType}
              todos={todos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        handleErrorChange={setError}
        errorText={errorText}
      />
    </div>
  );
};

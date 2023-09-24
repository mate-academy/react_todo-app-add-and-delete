/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';

import { TodoList } from './components/TodoList';
import { TodoContext } from './components/TodoProvider';
import { Form } from './components/Form';
import { Todo } from './types/Todo';

enum FilterOption {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [filter, setFilter] = useState(FilterOption.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const {
    todos,
    setErrorMessage,
    errorMessage,
    deleteTodoHandler,
  } = useContext(TodoContext);

  const filteredTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filter) {
        case FilterOption.Active:
          return !completed;
        case FilterOption.Completed:
          return completed;
        case FilterOption.All:
        default:
          return true;
      }
    });
  }, [filter, todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(({ completed }) => completed);
  }, [todos]);

  const handleDeleteCompletedTodos = () => {
    completedTodos.forEach(({ id }) => {
      deleteTodoHandler(id);
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!activeTodos.length
            && (
              <button
                type="button"
                className="todoapp__toggle-all active"
                data-cy="ToggleAllButton"
              />
            )}

          <Form setTempTodo={setTempTodo} />
        </header>

        {!!filteredTodos.length
          && <TodoList todos={filteredTodos} tempTodo={tempTodo} />}

        {!!todos.length
          && (
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                {Object.values(FilterOption).map((option) => (
                  <a
                    key={option}
                    data-cy={`FilterLink${option}`}
                    href={`#/${option.toLowerCase()}`}
                    className={classNames(
                      'filter__link',
                      { selected: option === filter },
                    )}
                    onClick={() => setFilter(option)}
                  >
                    {option}
                  </a>
                ))}
              </nav>

              {!!completedTodos.length
                && (
                  <button
                    type="button"
                    className="todoapp__clear-completed"
                    data-cy="ClearCompletedButton"
                    onClick={handleDeleteCompletedTodos}
                  >
                    Clear completed
                  </button>
                )}
            </footer>
          )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import * as todosServices from './api/todos';
import { FILTER } from './types/FILTER';
import { Errors } from './types/Errors';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11711;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(FILTER.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [statusResponce, setStatusResponce] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    setIsLoading(true);

    todosServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.Load))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    let preparedTodos = [...todos];

    preparedTodos = preparedTodos.filter((todo) => {
      switch (currentFilter) {
        case FILTER.ACTIVE:
          return !todo.completed;

        case FILTER.COMPLETED:
          return todo.completed;

        case FILTER.ALL:
        default:
          return true;
      }
    });

    return preparedTodos;
  }, [todos, currentFilter]);

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const addTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(Errors.Title);

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponce(true);

    todosServices.createTodo(data)
      .then((newTodo) => {
        setTitle('');
        setTodos((currentTodo) => [...currentTodo, newTodo]);
      })
      .catch(() => setError(Errors.Add))
      .finally(() => {
        setTempTodo(null);
        setStatusResponce(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodo
            onSubmit={addTodo}
            title={title}
            setTitle={setTitle}
            statusResponce={statusResponce}
          />
        </header>

        {!isLoading && (
          <>
            <TodoList todos={visibleTodos} />

            {tempTodo && (
              <TodoItem todo={tempTodo} />
            )}

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {/* {activeTodos <= 1
                    ? `${activeTodos} item left`
                    : `${activeTodos} items left`} */}
                  {`${activeTodos} items left`}
                </span>

                <Filter
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                />

                {/* don't show this button if there are no completed todos */}
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
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
      </div>
    </div>
  );
};

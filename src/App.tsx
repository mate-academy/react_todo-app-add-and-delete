/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, postTodo } from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { TodoItem } from './components/Todo/Todo';
import { Filter } from './types/Filter';
import { TodoField } from './components/Todo/TodoField/TodoField';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  timer.current = window.setTimeout(() => setErrorMessage(''), 3000);

  const hideError = () => {
    clearTimeout(timer.current);
    setErrorMessage('');
  };

  const addPost = (title: string): Promise<void> => {
    setErrorMessage('');

    return postTodo(title)
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      });
  };

  const onDelete = (id: number) => {
    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setShouldFocus(true);
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const onCompleteDelete = useMemo(() => {
    return () => {
      const ids: number[] = [];

      todos.filter(todo => todo.completed).forEach(todo => ids.push(todo.id));

      for (let i = 0; i < ids.length; i++) {
        onDelete(ids[i]);
      }
    };
  }, [todos]);

  const preparedTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const unCompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoField
          unCompletedTodos={unCompletedTodos}
          todosLength={todos.length}
          setErrorMessage={setErrorMessage}
          addPost={value => addPost(value)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTempTodo={setTempTodo}
          shouldFocus={shouldFocus}
          setShouldFocus={setShouldFocus}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {preparedTodos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} onDelete={id => onDelete(id)} />
          ))}

          {tempTodo && (
            <>
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                onDelete={id => onDelete(id)}
                isLoading={isLoading}
              />
            </>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${unCompletedTodos} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === Filter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === Filter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === Filter.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.length === unCompletedTodos}
              onClick={onCompleteDelete}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};

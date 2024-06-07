/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deletePost, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoContext } from './contexts/TodoContext';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorContext } from './contexts/ErrorContext';
import { Header } from './components/Header';
import { ActionType } from './contexts/types/Actions';

export enum FilterType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  const { todos, dispatch } = useContext(TodoContext);
  const { error, setError } = useContext(ErrorContext);

  useEffect(() => {
    getTodos()
      .then(response => {
        dispatch({ type: ActionType.SET, payload: response });
      })
      .catch(() => {
        setError('Unable to load todos');
      });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [dispatch, setError]);

  const getFormedTodos = useCallback(
    (todosItems: Todo[]) => {
      switch (filter) {
        case FilterType.ALL: {
          return todosItems;
        }

        case FilterType.ACTIVE: {
          return todosItems.filter(todo => !todo.completed);
        }

        case FilterType.COMPLETED: {
          return todosItems.filter(todo => todo.completed);
        }
      }
    },
    [filter],
  );

  const deleteAll = () => {
    for (const todo of todos.filter(td => td.completed)) {
      if (error) {
        break;
      }

      deletePost(todo.id)
        .then(() => {
          dispatch({ type: ActionType.DELETE, payload: todo.id });
        })
        .catch(() => {
          setError('Unable to delete a todo');
        });
    }

    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header inputRef={inputRef} />

        <section className="todoapp__main" data-cy="TodoList">
          <div>
            {todos && (
              <TodoList todos={getFormedTodos(todos)} inputRef={inputRef} />
            )}
          </div>
        </section>

        {!!todos.length && (
          <Footer filter={filter} setFilter={setFilter} deleteAll={deleteAll} />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
        <br />
        {/* Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};

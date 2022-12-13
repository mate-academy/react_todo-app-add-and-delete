/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addTodo,
  getTodos,
} from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterTodos } from './components/FilterTodos';
import { NewTodoField } from './components/NewTodoField';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(Status.All);
  const [error, setError] = useState(ErrorMessage.None);
  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const loadUserTodos = useCallback(() => {
    if (!user) {
      return;
    }

    setError(ErrorMessage.None);

    try {
      getTodos(user.id)
        .then(setTodos);
    } catch {
      setError(ErrorMessage.NoTodos);
    }
  }, [user]);

  useEffect(() => {
    loadUserTodos();
  }, [user]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (title.trim() !== '' && user) {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await loadUserTodos();

        setTitle('');
      } else {
        setError(ErrorMessage.Add);
      }
    }, [title, user],
  );

  const showedTodos = useMemo(() => (
    todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return true;
      }
    })
  ), [status, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: activeTodos.length === 0,
                },
              )}
            />
          )}

          <NewTodoField
            onSubmit={handleSubmit}
            title={title}
            onTitleChange={setTitle}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={showedTodos}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <FilterTodos
                status={status}
                onStatusChange={setStatus}
              />

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                style={activeTodos.length === todos.length
                  ? {
                    opacity: 0,
                    pointerEvents: 'none',
                  }
                  : {}}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onErrorChange={setError}
      />
    </div>
  );
};

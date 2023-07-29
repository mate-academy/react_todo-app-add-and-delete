/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoNotification } from './components/TodoNotification';

const USER_ID = 11145;

const getVisibleTodos = (todos: Todo[], status: Status) => {
  return todos
    .filter(todo => {
      switch (status) {
        case Status.Completed:
          return todo.completed;

        case Status.Active:
          return !todo.completed;

        default:
          return true;
      }
    });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [error, setError] = useState(Error.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [loadingTempTodo, setLoadingTempTodo] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Error.Load));
  }, []);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, status);
  }, [todos, status]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const areTodosEmpty = visibleTodos.length === 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (titleNewTodo: string) => {
    setLoadingTempTodo(true);

    const newTodo: Todo = {
      userId: USER_ID,
      title: titleNewTodo,
      completed: false,
      id: 0,
    };

    setTempTodo(newTodo);

    todoService.addTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
      })
      .catch(() => {
        setError(Error.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingTempTodo(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.EmptyTitle);
    } else {
      addTodo(title);
      setTitle('');
    }
  };

  const deleteCompletedTodos = () => {
    completedTodos.forEach(({ id }) => todoService.deleteTodo(id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!areTodosEmpty && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </form>
        </header>

        {!areTodosEmpty && (
          <TodoList
            todos={visibleTodos}
            onTodosChange={setTodos}
            tempTodo={tempTodo}
            loadingTempTodo={loadingTempTodo}
            onErrorChange={setError}
          />
        )}

        {!areTodosEmpty && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter
              status={status}
              onStatusChange={setStatus}
            />

            <button
              type="button"
              className={cn('todoapp__clear-completed', {
                disabled: !completedTodos.length,
              })}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {error && (
        <TodoNotification
          error={error}
          onErrorChange={setError}
        />
      )}
    </div>
  );
};

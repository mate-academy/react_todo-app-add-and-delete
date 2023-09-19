/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoItem } from './components/TodoItem';
import { Status } from './types/Status';
import { Filter } from './components/TodoFilter';

const USER_ID = 11498;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter]
    = useState<Status>(Status.All);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [areAllTodosCompleted, setAreAllTodosCompleted] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wasTodoAdded, setWasTodoAdded] = useState(false);

  const errorTimeoutId = useRef(0);

  const handleError = (message: string) => {
    setHasError(true);
    setErrorMessage(message);
    errorTimeoutId.current = window.setTimeout(() => {
      setHasError(false);
    }, 3000);
  };

  const filteredTodos = todos.filter(todo => {
    switch (activeFilter) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      case Status.All:
      default:
        return true;
    }
  });

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const activeTodosCount = todos.length - completedTodosCount;

  useEffect(() => {
    let timeoutID = 0;

    setHasError(false);

    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => {
        setHasError(true);
        setErrorMessage('Unable to load todos');
        timeoutID = window.setTimeout(() => {
          setHasError(false);
        }, 3000);
      });

    return () => window.clearTimeout(timeoutID);
  }, [activeFilter]);

  useEffect(() => {
    setHasError(false);

    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));

    return () => window.clearTimeout(errorTimeoutId.current);
  }, [activeFilter]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wasTodoAdded) {
      inputRef.current?.focus();
    }
  }, [wasTodoAdded]);

  const deleteTodo = (todoId: number) => {
    return client.delete(`/todos/${todoId}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => handleError('Unable to add a todo'));
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const allCompletedTodoDelete = () => {
    setAreAllTodosCompleted(true);

    Promise.all(completedTodos.map(todo => client.delete(`/todos/${todo.id}`)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => handleError('Unable to add a todos'))
      .finally(() => setAreAllTodosCompleted(false));
  };

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    window.clearTimeout(errorTimeoutId.current);

    if (query.trim() === '') {
      handleError('Title can`t be empty');

      return;
    }

    const data = {
      title: query.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...data, id: 0 });
    setIsLoading(true);
    setWasTodoAdded(false);

    client.post<Todo>('/todos', data)
      .then(response => {
        setTodos([...todos, response]);
        setQuery('');
      })
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setWasTodoAdded(true);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all active', {
              active: completedTodosCount !== 0,
            })}
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={addTodo}
          >
            <input
              type="text"
              value={query}
              ref={inputRef}
              onChange={e => setQuery(e.target.value)}
              onBlur={() => setWasTodoAdded(false)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              areAllTodosCompleted={areAllTodosCompleted}
            />
          ))}
          {tempTodo && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button type="button" className="todo__remove">×</button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {/* {todos.length > 0 && ( */}
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodosCount} items left`}
          </span>

          <Filter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {/* don't show this button if there are no completed todos */}
          <button
            type="button"
            className={classNames('todoapp__clear-completed', {
              'todoapp__clear-completed--hidden': completedTodosCount === 0,
            })}
            onClick={allCompletedTodoDelete}
          >
            Clear completed
          </button>
        </footer>
        {/* )} */}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !hasError },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setHasError(false)}
        />

        {errorMessage}
      </div>
    </div>
  );
};

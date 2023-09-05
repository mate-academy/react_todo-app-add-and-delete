/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ActiveFilter } from './types/ActiveFilter';
import { client } from './utils/fetchClient';
import { TodoItem } from './components/TodoItem';
import { Filter } from './components/Filter';

const USER_ID = 11382;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter]
    = useState<ActiveFilter>(ActiveFilter.All);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [wasTodoAdded, setWasTodoAdded] = useState(false);
  const [areAllCompletedDeleting, setAreAllCompletedDeleting] = useState(false);

  const filteredTodos = todos.filter(todo => {
    switch (activeFilter) {
      case ActiveFilter.Active:
        return !todo.completed;

      case ActiveFilter.Completed:
        return todo.completed;

      case ActiveFilter.All:
      default:
        return true;
    }
  });

  const completedTodos = todos.filter(todo => todo.completed);

  const activeTodosCount = todos.length - completedTodos.length;

  const inputRef = useRef<HTMLInputElement>(null);

  const errorTimeoutID = useRef(0);

  const handleError = (message: string) => {
    setHasError(true);
    setErrorMessage(message);
    errorTimeoutID.current = window.setTimeout(() => {
      setHasError(false);
    }, 3000);
  };

  useEffect(() => {
    setHasError(false);

    client.get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));

    return () => window.clearTimeout(errorTimeoutID.current);
  }, [activeFilter]);

  useEffect(() => {
    if (wasTodoAdded) {
      inputRef.current?.focus();
    }
  }, [wasTodoAdded]);

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    window.clearTimeout(errorTimeoutID.current);

    if (inputValue.trim() === '') {
      handleError("Title can't be empty");

      return;
    }

    const data = {
      title: inputValue.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...data, id: 0 });

    setIsLoading(true);
    setWasTodoAdded(false);

    client.post<Todo>('/todos', data)
      .then(response => {
        setTodos([...todos, response]);
        setInputValue('');
      })
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setWasTodoAdded(true);
      });
  };

  const deleteTodo = (
    todoId: number,
  ) => {
    return client.delete(`/todos/${todoId}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => handleError('Unable to delete a todo'));
  };

  const deleteAllCompleted = () => {
    setAreAllCompletedDeleting(true);

    Promise.all(completedTodos.map(todo => client.delete(`/todos/${todo.id}`)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => handleError('Unable to delete todos'))
      .finally(() => setAreAllCompletedDeleting(false));
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
              active: completedTodos.length !== 0,
            })}
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={addTodo}
          >
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
              onBlur={() => setWasTodoAdded(false)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              areAllCompletedDeleting={areAllCompletedDeleting}
            />
          ))}

          {/* This todo is in loadind state */}
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
              'todoapp__clear-completed--hidden': completedTodos.length === 0,
            })}
            onClick={deleteAllCompleted}
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

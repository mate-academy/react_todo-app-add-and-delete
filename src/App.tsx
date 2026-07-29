/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const isErrorNotificationHidden = errorMessage === null;
  const hasTodos = todos.length > 0;
  const titleField = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = React.useState('');
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [delTodos, setDelTodos] = React.useState<Array<number>>([]);
  // const isLoading = delTodos.length > 0;

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (status === Status.Active) {
        return !todo.completed;
      }

      if (status === Status.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, status]);

  useEffect(() => {
    getTodos()
      .then(todosList => {
        setTodos(todosList);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.Load);
      });
  }, []);

  React.useEffect(() => {
    titleField.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [errorMessage]);

  const handleDelete = (todoId: number) => {
    setDelTodos(currentIds => [...currentIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.Delete);
      })
      .finally(() => {
        setDelTodos(currentIds => currentIds.filter(id => id !== todoId));
        titleField.current?.focus();
      });
  };

  useEffect(() => {
    if (!tempTodo) {
      titleField.current?.focus();
    }
  }, [tempTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessages.Empty);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.Add);
      })
      .finally(() => {
        setTempTodo(null);
        // titleField.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.allSettled(completedIds.map(id => handleDelete(id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              ref={titleField}
              value={title}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setTitle(event.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {/* TodoList component */}
        <TodoList
          todos={visibleTodos}
          onDelete={handleDelete}
          deletingIds={delTodos}
        />

        {tempTodo && (
          <TodoItem todo={tempTodo} isLoading onDelete={handleDelete} />
        )}

        {/* Hide the footer if there are no todos */}
        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(t => !t.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <TodoFilter status={status} onStatusChange={setStatus} />

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${isErrorNotificationHidden ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
        {/* Unable to load todos
        <br />
        Title should not be empty
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

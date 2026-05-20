/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deleteTodoIds, setDeleteTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteTodo = (todoId: number) => {
    setDeleteTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setDeleteTodoIds(currentIds => currentIds.filter(id => id !== todoId));

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsAdding(true);

    const temporaryTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(temporaryTodo);

    addTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const visibleTodos = todos.filter(todo => {
    if (filterStatus === 'active') {
      return !todo.completed;
    }

    if (filterStatus === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const getFilterLinkStatus = (status: FilterStatus) =>
    filterStatus === status ? 'filter__link selected' : 'filter__link';

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={
                allTodosCompleted
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isAdding}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <div
                  data-cy="Todo"
                  className={todo.completed ? 'todo completed' : 'todo'}
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      readOnly
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active': deleteTodoIds.includes(todo.id),
                    })}
                  >
                    <div
                      className="modal-background
                      has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              ))}
              {tempTodo && (
                <div className="todo" data-cy="Todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={false}
                      disabled
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div
                      className="modal-background
                      has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodos.length} items left
              </span>

              {/* Active link should have the 'selected' class */}
              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={getFilterLinkStatus('all')}
                  data-cy="FilterLinkAll"
                  onClick={event => {
                    event.preventDefault();
                    setFilterStatus('all');
                  }}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={getFilterLinkStatus('active')}
                  data-cy="FilterLinkActive"
                  onClick={event => {
                    event.preventDefault();
                    setFilterStatus('active');
                  }}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={getFilterLinkStatus('completed')}
                  data-cy="FilterLinkCompleted"
                  onClick={event => {
                    event.preventDefault();
                    setFilterStatus('completed');
                  }}
                >
                  Completed
                </a>
              </nav>

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodos.length === 0}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal
          ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};

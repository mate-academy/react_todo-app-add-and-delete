/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorMessage, Status, Todo } from './types/Todo';
import classNames from 'classnames';
import { getActiveTodos, getFilteredTodos } from './utils/helper';
import { TodoItem } from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(Status.all);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [waitingDeleteTodos, setWaitingDeleteTodos] = useState<number[]>([]);
  const [keyToForm, setKeyToForm] = useState(0);
  const [formDisabled, setFormDisabled] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load))
      .finally();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteTodo = (id: number) => {
    setWaitingDeleteTodos(current => [...current, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setWaitingDeleteTodos(current => current.filter(item => item !== id));
        setKeyToForm(current => current + 1);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessage.TitleEmpty);

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    });

    setFormDisabled(true);

    createTodo(normalizedTitle)
      .then(todo => {
        setTodos(current => [...current, todo]);
        setNewTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setTempTodo(null);
        setKeyToForm(current => current + 1);
        setFormDisabled(false);
      });
  };

  const handleBundleDelete = () => {
    for (const todo of todos) {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    }
  };

  // const showTodosAndFooter = todos.length > 0;
  const showToggleAllButton = todos.length > 0;
  const activeTodos = getActiveTodos(todos);
  const filteredTodos = getFilteredTodos(todos, statusFilter);
  const isAllCompleted = todos.length > 0 && activeTodos.length === 0;
  const completedTodos = todos.length - activeTodos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit} key={keyToForm}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              autoFocus
              disabled={formDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              loader={waitingDeleteTodos.includes(todo.id)}
            />
          ))}

          {tempTodo && (
            <TodoItem todo={tempTodo} loader={true} onDelete={() => {}} />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {showToggleAllButton && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: statusFilter === Status.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setStatusFilter(Status.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: statusFilter === Status.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setStatusFilter(Status.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: statusFilter === Status.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setStatusFilter(Status.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleBundleDelete}
              disabled={completedTodos < 1}
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
        {/* show only one message at a time */}
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

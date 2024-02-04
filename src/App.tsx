/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { SortType } from './types/SortType';
import { TodoList } from './components/TodoList';

const USER_ID = 103;

function filterTodoList(todos: Todo[], sortKey: SortType) {
  switch (sortKey) {
    case SortType.Completed:
      return todos.filter(todo => todo.completed);

    case SortType.Active:
      return todos.filter(todo => !todo.completed);

    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [sortBy, setSortBy] = useState<SortType>(SortType.All);

  const filteredTodos = filterTodoList(todos, sortBy);

  const ACTIVE_TODO
    = todos.length - filterTodoList(todos, SortType.Completed).length;

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LoadError))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, [setTodos]);

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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodoList todos={filteredTodos} />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${ACTIVE_TODO} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  { 'filter__link selected': sortBy === SortType.All },
                )}
                data-cy="FilterLinkAll"
                onClick={() => setSortBy(SortType.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  { 'filter__link selected': sortBy === SortType.Active },
                )}
                data-cy="FilterLinkActive"
                onClick={() => setSortBy(SortType.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { 'filter__link selected': sortBy === SortType.Completed },
                )}
                data-cy="FilterLinkCompleted"
                onClick={() => setSortBy(SortType.Completed)}

              >
                Completed
              </a>
            </nav>

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

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {!!errorMessage.length && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {/* show only one message at a time */}
          {errorMessage}
          <br />
        </div>
      )}

    </div>
  );
};

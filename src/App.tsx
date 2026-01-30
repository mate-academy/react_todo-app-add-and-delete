/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { filterTodos } from './filtersTodos';

export enum FilterState {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isClearingCompleted, setIsClearingCompleted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterState>(
    FilterState.All,
  );

  const errorTimerId = useRef(0);
  const showError = (message: string) => {
    setErrorMessage(message);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage('');
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isAdding && deletingTodoId === null && !isClearingCompleted) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdding, deletingTodoId, isClearingCompleted]);

  function handleHideError() {
    setErrorMessage('');
  }

  function handleFilterChange(
    event: React.MouseEvent,
    newFilterState: FilterState,
  ) {
    event.preventDefault();

    setSelectedFilter(newFilterState);
  }

  function handleAddTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      showError('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTempTodo);

    todoService
      .addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsAdding(false);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setErrorMessage('');
    setDeletingTodoId(todoId);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoId(null);
      });
  }

  function handleClearCompleted() {
    setErrorMessage('');
    setIsClearingCompleted(true);

    const completedTodos = todos.filter(todo => todo.completed);

    const requests = completedTodos.map(todo =>
      todoService.deleteTodo(todo.id),
    );

    Promise.allSettled(requests).then(results => {
      const hasError = results.some(r => r.status === 'rejected');

      setTodos(prev =>
        prev.filter(
          todo =>
            !completedTodos.some(
              completedTodo =>
                completedTodo.id === todo.id &&
                results[
                  completedTodos.findIndex(t => t.id === completedTodo.id)
                ].status === 'fulfilled',
            ),
        ),
      );

      if (hasError) {
        showError('Unable to delete a todo');
      }

      setIsClearingCompleted(false); // 👈 КЛЮЧОВО
    });
  }

  const filteredTodos = filterTodos(selectedFilter, todos);

  const notConpletedCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = todos.some(todo => todo.completed);

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
          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              autoFocus
              disabled={isAdding}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={deletingTodoId === todo.id}
                onDelete={() => handleDeleteTodo(todo.id)}
              />
            ))}

            {tempTodo && <TodoItem todo={tempTodo} isLoading />}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {notConpletedCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedFilter === FilterState.All,
                })}
                data-cy="FilterLinkAll"
                onClick={event => handleFilterChange(event, FilterState.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedFilter === FilterState.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={event => handleFilterChange(event, FilterState.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedFilter === FilterState.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={event =>
                  handleFilterChange(event, FilterState.Completed)
                }
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
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
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleHideError()}
        />
        {errorMessage}
        {/* show only one message at a time */}
        {/*
        Unable to update a todo */}
      </div>
    </div>
  );
};

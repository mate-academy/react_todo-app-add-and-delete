/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import cn from 'classnames';

import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem';

function getVisibleTodos(todos: Todo[], status: Status) {
  switch (status) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const timerRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    clearTimeout(timerRef.current);
    setErrorMessage(message);
    timerRef.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo, todos]);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const visibleTodos = getVisibleTodos(todos, filter);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      showError('Title should not be empty');

      return;
    }

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    addTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  };

  const handleDelete = (todoId: number) => {
    setLoadingIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId)),
      )
      .catch(() => showError('Unable to delete a todo'))
      .finally(() =>
        setLoadingIds(prevIds => prevIds.filter(id => id !== todoId)),
      );
  };

  const clearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(completedTodo => handleDelete(completedTodo.id));
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
              disabled={tempTodo !== null}
              ref={inputRef}
              value={title}
              onChange={event => setTitle(event.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              isLoading={loadingIds.includes(todo.id)}
              key={todo.id}
              onDelete={handleDelete}
            />
          ))}
          {tempTodo && <TodoItem todo={tempTodo} isLoading />}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                onClick={() => setFilter(Status.All)}
                href="#/"
                className={cn('filter__link', {
                  selected: filter === Status.All,
                })}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                onClick={() => setFilter(Status.Active)}
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === Status.Active,
                })}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                onClick={() => setFilter(Status.Completed)}
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === Status.Completed,
                })}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              disabled={!todos.some(todo => todo.completed)}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
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
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

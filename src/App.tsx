import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import * as clientMethods from './api/todos';
import type { Todo } from './types/Todo';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { TodoItem } from './components/TodoItem';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(ErrorType.None);
  const [selectedFilterLink, setSelectedFilterLink] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const inputFocusRef = useRef<HTMLInputElement>(null);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const filterLinks = [
    {
      label: 'All',
      value: FilterType.All,
      href: '#/',
      dataCy: 'FilterLinkAll',
    },
    {
      label: 'Active',
      value: FilterType.Active,
      href: '#/active',
      dataCy: 'FilterLinkActive',
    },
    {
      label: 'Completed',
      value: FilterType.Completed,
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  const handleAddTodo = (newTodo: Todo): void => {
    setTodos([...todos, newTodo]);
  };

  const handleDelete = async (deleteId: number) => {
    setDeletingIds(current => [...current, deleteId]);

    try {
      await clientMethods.deleteTodo(deleteId);
      setTodos(current => current.filter(todo => todo.id !== deleteId));
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setDeletingIds(current => current.filter(id => id !== deleteId));
      inputFocusRef.current?.focus();
    }
  };

  const handleClearCompleted = () => {
    Promise.all(completedTodos.map(todo => handleDelete(todo.id)));
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await clientMethods.getTodos();

        setTodos(loadedTodos);
      } catch (err) {
        setError(ErrorType.Load);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(ErrorType.None), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  let filteredTodos = todos;

  switch (selectedFilterLink) {
    case FilterType.Active:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;
    case FilterType.Completed:
      filteredTodos = todos.filter(todo => todo.completed);
      break;
    default:
      filteredTodos = todos;
      break;
  }

  if (!clientMethods.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodoForm
            onAdd={handleAddTodo}
            onError={setError}
            setTempTodo={setTempTodo}
            inputFocusRef={inputFocusRef}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {!isLoading && (
            <>
              <TodoList
                todos={filteredTodos}
                onDelete={handleDelete}
                deletingIds={deletingIds}
              />
              {tempTodo && <TodoItem todo={tempTodo} isLoading />}
            </>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              {filterLinks.map(link => (
                <a
                  key={link.value}
                  href={link.href}
                  className={`filter__link ${selectedFilterLink === link.value ? 'selected' : ''}`}
                  data-cy={link.dataCy}
                  onClick={() => setSelectedFilterLink(link.value)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className={`todoapp__clear-completed
              ${completedTodos.length === 0 ? 'hidden' : ''}`}
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {hidden: !error},
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(ErrorType.None)}
        />
        {error}
      </div>
    </div>
  );
};

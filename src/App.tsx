/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterType, filters } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [value, setValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const hasAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  const itemsLabel = activeTodos.length === 1 ? 'item' : 'items';

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const visibleTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return true;
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tempTodo !== null) {
      return;
    }

    const title = value.trim();

    if (!title) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);
    setError(null);
    createTodo(title)
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setValue('');
      })
      .catch(() => setError(ErrorMessage.AddTodo))
      .finally(() => setTempTodo(null));
  };

  const handleDelete = (id: number) => {
    if (deletingIds.includes(id)) {
      return;
    }

    setDeletingIds(prev => [...prev, id]);
    setError(null);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setError(ErrorMessage.DeleteTodo))
      .finally(() => {
        setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${hasAllTodosCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            disabled={todos.length === 0}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={value}
              onChange={e => setValue(e.target.value)}
              disabled={tempTodo !== null}
              ref={inputRef}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            onDelete={handleDelete}
            deletingIds={deletingIds}
            tempTodo={tempTodo}
            todos={visibleTodos}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} {itemsLabel} left
            </span>

            <nav className="filter" data-cy="Filter">
              {filters.map(filter => (
                <a
                  key={filter.type}
                  href={filter.href}
                  className={`filter__link ${
                    filterType === filter.type ? 'selected' : ''
                  }`}
                  data-cy={filter.dataCy}
                  onClick={() => setFilterType(filter.type)}
                >
                  {filter.title}
                </a>
              ))}
            </nav>

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

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

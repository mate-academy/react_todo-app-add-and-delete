// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoComponent } from './components/TodoComponent';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [inputValue, setInputValue] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      setError('Unable to load todos');
    }
  };

  const handleFocus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    loadTodos();
    handleFocus();
  }, [handleFocus, todos]);

  useEffect(() => {
    if (error !== null) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return setError('Title should not be empty');
    }

    const newTodo = {
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    try {
      const createdTodo = await postTodo(newTodo);

      setTempTodo(null);
      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setInputValue('');
    } catch {
      setError('Unable to add todo');
    } finally {
      handleFocus();
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all"
            data-cy="ToggleAllButton"
          />
          <form onSubmit={addTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={handleInputChange}
              disabled={!!tempTodo}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoComponent key={todo.id} todo={todo} />
          ))}
          {tempTodo && <TodoComponent key={tempTodo.id} todo={tempTodo} />}
        </section>
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
        <div
          data-cy="ErrorNotification"
          className={`notification is-danger is-light has-text-weight-normal ${
            error ? '' : 'hidden'
          }`}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
          {error}
        </div>
      </div>
    </div>
  );
};

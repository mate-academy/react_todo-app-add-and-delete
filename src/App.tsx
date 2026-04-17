/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo as deleteTodoAPI,
} from './api/todos';

type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  const focusInput = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newTitle.trim();

    if (!trimmed) {
      showError('Title should not be empty');
      focusInput();

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);
    setLoading(true);

    createTodo(temp)
      .then(todo => {
        setTodos(prev => [...prev, todo]);
        setNewTitle('');
        setTempTodo(null);
        focusInput();
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);
        focusInput();
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodoAPI(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setSelectedIds(prev => prev.filter(sel => sel !== id));
        focusInput();
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setProcessingIds(prev => prev.filter(pid => pid !== id));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach(id => handleDelete(id));
    setSelectedIds([]);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const visibleTodos = tempTodo ? [...filteredTodos, tempTodo] : filteredTodos;

  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);
  const hasTodos = todos.length > 0 || tempTodo !== null;

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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
              disabled={loading}
            />
          </form>
        </header>

        {!!visibleTodos.length && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => {
              const isTemp = todo.id === 0;
              const isProcessing = processingIds.includes(todo.id);

              return (
                <div
                  key={isTemp ? 'temp' : todo.id}
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(todo.id)}
                    onChange={() => {
                      setSelectedIds(prev =>
                        prev.includes(todo.id)
                          ? prev.filter(id => id !== todo.id)
                          : [...prev, todo.id],
                      );
                    }}
                  />

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

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDelete(todo.id)}
                    disabled={isProcessing}
                  >
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${
                      isTemp || isProcessing ? 'is-active' : 'is-hidden'
                    }`}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>

            <button
              type="button"
              disabled={!selectedIds.length}
              onClick={handleDeleteSelected}
            >
              Delete selected
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};

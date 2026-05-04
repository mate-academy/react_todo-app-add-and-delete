/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import {
  USER_ID,
  getTodos,
  createTodo,
  updateTodo,
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
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [shouldFocus, setShouldFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newTitle.trim();

    if (!trimmed) {
      showError('Title should not be empty');
      setShouldFocus(true);

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
        setShouldFocus(true);
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);
        setShouldFocus(true);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodoAPI(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setShouldFocus(true);
      })
      .catch(() => {
        showError('Unable to delete a todo');
        setShouldFocus(true);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(pid => pid !== id));
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    completed.forEach(todo => {
      handleDelete(todo.id);
    });
  };

  const handleToggleStatus = (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setProcessingIds(prev => [...prev, id]);

    const updatedTodo: Todo = { ...todo, completed: !todo.completed };

    updateTodo(id, { completed: !todo.completed })
      .then(() => {
        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      })
      .catch(() => {
        showError('Unable to update todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(pid => pid !== id));
      });
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
  const hasCompleted = todos.some(todo => todo.completed);
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
          <TodoList
            visibleTodos={filteredTodos}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            tempTodo={tempTodo}
            loadingTodoId={processingIds.length > 0 ? processingIds[0] : null}
          />
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
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
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
              onClick={handleClearCompleted}
              disabled={!hasCompleted}
            >
              Clear completed
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

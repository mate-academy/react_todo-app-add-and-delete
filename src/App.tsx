/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  USER_ID,
} from './api/todos';
import type { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const didFetch = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setError(message);
    setIsErrorVisible(true);
    setTimeout(() => setIsErrorVisible(false), 3000);
  };

  const loadTodos = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsErrorVisible(false);

    try {
      const data = await getTodos();
      setTodos(data.map(todo => ({ ...todo, loading: false })));
    } catch {
      showError('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!USER_ID || didFetch.current) {
      return;
    }

    didFetch.current = true;
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const allCompleted = todos.length > 0 && activeCount === 0;

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      showError('Title should not be empty');
      return;
    }

    const title = newTitle.trim();
    setIsAdding(true);

    const temp = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
      loading: true,
    };

    setTempTodo(temp);

    try {
      const newTodo = await createTodo(title);

      setTodos(prev => [...prev, { ...newTodo, loading: false }]);
      setTempTodo(null);
      setNewTitle('');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch {
      showError('Unable to add a todo');
      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } finally {
      setIsAdding(false);
    }
  };


  const handleDelete = async (id: number) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, loading: true } : todo)),
    );

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch {
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, loading: false } : todo)),
      );
      showError('Unable to delete a todo');
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, loading: true } : todo)),
    );

    try {
      const updated = await updateTodo(id, { completed: !completed });
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...updated, loading: false } : todo,
        ),
      );
    } catch {
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, loading: false } : todo)),
      );
      showError('Unable to update a todo');
    }
  };

  const handleRename = async (id: number) => {
    if (!editingTitle.trim()) {
      await handleDelete(id);
      return;
    }

    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, loading: true } : todo)),
    );

    try {
      const updated = await updateTodo(id, { title: editingTitle.trim() });
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...updated, loading: false } : todo,
        ),
      );
      setEditingId(null);
      setEditingTitle('');
    } catch {
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, loading: false } : todo)),
      );
      showError('Unable to update a todo');
    }
  };

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
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            disabled={todos.length === 0 || isLoading}
          />
          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {!isLoading && (visibleTodos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id, todo.completed)}
                    disabled={todo.loading}
                  />
                </label>

                {editingId === todo.id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleRename(todo.id);
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      onBlur={() => handleRename(todo.id)}
                      ref={input => input && input.focus()}
                    />
                  </form>
                ) : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>
                )}

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                  disabled={todo.loading}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${todo.loading ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
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
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled
                >
                  ×
                </button>
                <div
                  data-cy="TodoLoader"
                  className="modal overlay is-active"
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  setFilter('all');
                }}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  setFilter('active');
                }}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
              onClick={() => {
                todos
                  .filter(todo => todo.completed)
                  .forEach(todo => handleDelete(todo.id));
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          isErrorVisible ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsErrorVisible(false)}
        />
        {error}
      </div>
    </div>
  );
};

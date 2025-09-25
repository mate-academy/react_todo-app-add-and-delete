/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './utils/fetchClients';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // States to manage todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editing, setEditing] = useState<{
    id: number | null;
    title: string;
  }>({ id: null, title: '' });
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  // State for todos being deleted
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Fetch todos when component loads
  useEffect(() => {
    // If no USER_ID, don't make request and don't show error
    if (!USER_ID) {
      setLoading(null);
      setError('');
      setTodos([]);

      return;
    }

    setLoading('loading');
    setError(''); // Always clear error before request

    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(data => {
        setTodos(Array.isArray(data) ? data : []);
        setError(''); // Clear error on success
      })
      .catch(() => {
        // For initial load, never show error - just show empty list
        setTodos([]);
        setError(''); // Never show error on initial load
      })
      .finally(() => {
        setLoading(null);
      });
  }, []);

  // Focus input when necessary
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  // Focus edit input
  useEffect(() => {
    if (editing.id && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing.id]);

  // Check if user is logged in AFTER all hooks
  if (!USER_ID) {
    return <UserWarning />;
  }

  // Function to add new todo
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTodo.trim();

    if (!title) {
      return; // Don't show error for empty input, just do nothing
    }

    // Create temporary todo while loading
    const temp = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);
    setLoading('adding');
    setNewTodo('');
    setError(''); // Clear any previous errors

    // Send to server
    client
      .post<Todo>('/todos', temp)
      .then(addedTodo => {
        setTodos(prev => [...prev, addedTodo]);
        setError(''); // Ensure error is cleared on success
      })
      .catch(() => {
        setError('Unable to add a todo');
        setNewTodo(title); // Restore the input value
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(null);
      });
  };

  // Function to delete todo
  const deleteTodo = (id: number) => {
    setDeletingIds(prev => [...prev, id]);
    setLoading(`deleting-${id}`);
    setError('');

    client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setError('');
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setLoading(null);
        setDeletingIds(prev => prev.filter(delId => delId !== id));
      });
  };

  // Function to toggle complete status
  const toggleComplete = (id: number) => {
    setLoading(`completing-${id}`);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setError('');

    client
      .patch<Todo>(`/todos/${id}`, { completed: !todo.completed })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
        setError('');
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setLoading(null));
  };

  // Function to edit todo
  const editTodo = (id: number) => {
    const title = editing.title.trim();
    const originalTodo = todos.find(t => t.id === id);

    if (!originalTodo) {
      return;
    }

    // If title is empty, delete the task
    if (!title) {
      setEditing({ id: null, title: '' });
      deleteTodo(id);

      return;
    }

    // If title hasn't changed, just cancel editing
    if (title === originalTodo.title) {
      setEditing({ id: null, title: '' });

      return;
    }

    setLoading(`editing-${id}`);
    setError('');

    client
      .patch<Todo>(`/todos/${id}`, { title })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
        setEditing({ id: null, title: '' });
        setError('');
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setLoading(null));
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditing({ id: null, title: '' });
  };

  // Function to handle keys during editing
  const handleEditKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Function to toggle all todos - FIXED
  const toggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const newStatus = !allCompleted;

    // Filter only todos that actually need to be changed
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoading('completing-all');
    setError('');

    Promise.all(
      todosToUpdate.map(todo =>
        client.patch(`/todos/${todo.id}`, { completed: newStatus }),
      ),
    )
      .then(() => {
        setTodos(prev => prev.map(t => ({ ...t, completed: newStatus })));
        setError('');
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setLoading(null));
  };

  // Function to clear completed
  const clearCompleted = () => {
    setLoading('clearing');
    const completed = todos.filter(t => t.completed);

    setError('');

    Promise.all(completed.map(t => client.delete(`/todos/${t.id}`)))
      .then(() => {
        setTodos(prev => prev.filter(t => !t.completed));
        setError('');
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setLoading(null));
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // Count active tasks
  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {/* Header with input */}
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${activeCount === 0 && todos.length > 0 ? 'active' : ''}`}
            onClick={toggleAll}
            disabled={loading === 'completing-all'}
            data-cy="ToggleAllButton"
            aria-label="Toggle all todos"
          />

          <form style={{ position: 'relative' }} onSubmit={addTodo}>
            <input
              ref={inputRef}
              type="text"
              data-cy="NewTodoField"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              disabled={!!loading}
            />
            {/* Loading overlay over input when adding */}
            {tempTodo && (
              <div className="loading-overlay">
                <div className="loading-spinner" />
              </div>
            )}
          </form>
        </header>

        {/* Todo list */}
        <section className="todoapp__main" data-cy="TodoList">
          {loading === 'loading' && (
            <div className="loading-todos">
              <div className="loading-spinner" />
              <span>Loading todos...</span>
            </div>
          )}

          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
              style={{ position: 'relative' }}
            >
              <label className="todo__status-label">
                <input
                  className="todo__status"
                  type="checkbox"
                  data-cy="TodoStatus"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  disabled={
                    loading === `completing-${todo.id}` ||
                    deletingIds.includes(todo.id) ||
                    editing.id === todo.id
                  }
                />
              </label>

              {editing.id === todo.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    editTodo(todo.id);
                  }}
                >
                  <input
                    ref={editInputRef}
                    type="text"
                    className="todo__title-field"
                    value={editing.title}
                    onChange={e =>
                      setEditing({
                        ...editing,
                        title: e.target.value,
                      })
                    }
                    onBlur={() => editTodo(todo.id)}
                    onKeyUp={e => handleEditKeyUp(e)}
                  />
                </form>
              ) : (
                <span
                  className="todo__title"
                  data-cy="TodoTitle"
                  onDoubleClick={() =>
                    setEditing({
                      id: todo.id,
                      title: todo.title,
                    })
                  }
                >
                  {todo.title}
                </span>
              )}

              {editing.id !== todo.id && (
                <button
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(todo.id)}
                  disabled={
                    loading === `deleting-${todo.id}` ||
                    deletingIds.includes(todo.id)
                  }
                >
                  ×
                </button>
              )}

              {/* Loading overlay */}
              {(deletingIds.includes(todo.id) ||
                loading === `editing-${todo.id}` ||
                loading === `completing-${todo.id}`) && (
                <div className="loading-overlay">
                  <div className="loading-spinner" />
                </div>
              )}
            </div>
          ))}

          {/* Temporary todo during loading */}
          {tempTodo && (
            <div className="todo" style={{ position: 'relative' }}>
              <div className="todo__status">
                <input type="checkbox" checked={false} disabled />
              </div>
              <div className="todo__title">{tempTodo.title}</div>
              <div className="loading-overlay">
                <div className="loading-spinner" />
              </div>
            </div>
          )}
        </section>

        {/* Footer with filters */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} item{activeCount !== 1 ? 's' : ''} left
            </span>

            <div className="filters" data-cy="Filter">
              <button
                data-cy="FilterLinkAll"
                className={`filter__link${filter === 'all' ? ' selected' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                data-cy="FilterLinkActive"
                className={`filter__link${filter === 'active' ? ' selected' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                data-cy="FilterLinkCompleted"
                className={`filter__link${filter === 'completed' ? ' selected' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>

            {hasCompleted && (
              <button
                data-cy="ClearCompletedButton"
                className="todoapp__clear-completed"
                onClick={clearCompleted}
                disabled={loading === 'clearing'}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Error message - Only show if there are todos or user has interacted */}
      {error && error.trim() && !loading && todos.length > 0 && (
        <div className="error-message" data-cy="ErrorNotification">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
    </div>
  );
};

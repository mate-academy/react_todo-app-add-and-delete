/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './api/client';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null); 
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoadingAction('load');
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => setInitialLoadFailed(true))
      .finally(() => setLoadingAction(null));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [newTodoTitle]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTodoTitle.trim();
    if (!title) {
      setErrorMessage('Title should not be empty');
      return;
    }

    const newTempTodo: Todo = { 
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingAction('add');

    client
      .post<Todo>('/todos', newTempTodo)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null); 
        setLoadingAction(null);
        inputRef.current?.focus(); 
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingAction(`delete-${id}`);
    client
      .delete(`/todos/${id}`)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoadingAction(null));
  };

  const handleToggleCompleted = (id: number) => {
    setLoadingAction(`toggle-${id}`);
    const foundTodo = todos.find(t => t.id === id);
    if (!foundTodo) return;

    client
      .patch<Todo>(`/todos/${id}`, { completed: !foundTodo.completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => t.id === id ? { ...t, completed: updatedTodo.completed } : t)
        );
      })
      .catch(() => setErrorMessage('Unable to update todo'))
      .finally(() => setLoadingAction(null));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEditing = (id: number) => {
    if (!editingTitle.trim()) {
      setErrorMessage('Title should not be empty');
      return;
    }

    setLoadingAction(`edit-${id}`);
    client
      .patch<Todo>(`/todos/${id}`, { title: editingTitle })
      .then(updatedTodo => {
        setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, title: updatedTodo.title } : todo));
        setEditingId(null);
        setEditingTitle('');
      })
      .catch(() => setErrorMessage('Unable to edit todo'))
      .finally(() => setLoadingAction(null));
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const clearCompleted = () => {
    setLoadingAction('clear');
    Promise.all(todos.filter(todo => todo.completed).map(todo => client.delete(`/todos/${todo.id}`)))
      .then(() => setTodos(prev => prev.filter(todo => !todo.completed)))
      .catch(() => setErrorMessage('Unable to clear completed todos'))
      .finally(() => setLoadingAction(null));
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = todos.some(todo => !todo.completed);
    setLoadingAction('toggle-all');
    Promise.all(todos.map(todo => client.patch(`/todos/${todo.id}`, { completed: shouldCompleteAll })))
      .then(() => setTodos(prev => prev.map(todo => ({ ...todo, completed: shouldCompleteAll }))))
      .catch(() => setErrorMessage('Unable to toggle all todos'))
      .finally(() => setLoadingAction(null));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active': return todos.filter(todo => !todo.completed);
      case 'completed': return todos.filter(todo => todo.completed);
      default: return todos;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${activeTodosCount === 0 ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
            disabled={loadingAction === 'toggle-all'}
          />
          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={loadingAction !== null}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {getFilteredTodos().map(todo => (
            <div key={todo.id} data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleToggleCompleted(todo.id)}
                  disabled={loadingAction === `toggle-${todo.id}`}
                />
              </label>

              {editingId === todo.id ? (
                <form onSubmit={e => { e.preventDefault(); saveEditing(todo.id); }}>
                  <input
                    type="text"
                    className="todoapp__new-todo"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => saveEditing(todo.id)}
                    autoFocus
                    disabled={loadingAction === `edit-${todo.id}`}
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => !todo.completed && startEditing(todo)}
                  style={{ cursor: !todo.completed ? 'pointer' : 'default' }}
                >
                  {todo.title}
                </span>
              )}

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
                disabled={loadingAction === `delete-${todo.id}`}
              >
                ×
              </button>
            </div>
          ))}

          {tempTodo && (
            <div data-cy="Todo" className="todo temp">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" disabled />
              </label>
              <span className="todo__title">{tempTodo.title}</span>
              <div className="loader" />
            </div>
          )}
        </section>
      </div>

      {todos.length > 0 && (
        <div className="todoapp__content">
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">{activeTodosCount} items left</span>

            <nav className="filter" data-cy="Filter">
              <button
                type="button"
                className={`filter__link${filter === 'all' ? ' selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter__link${filter === 'active' ? ' selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                type="button"
                className={`filter__link${filter === 'completed' ? ' selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </nav>

            {hasCompletedTodos && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={clearCompleted}
                disabled={loadingAction === 'clear'}
              >
                Clear completed
              </button>
            )}
          </footer>
        </div>
      )}

      {errorMessage && !initialLoadFailed && (
        <div data-cy="ErrorNotification" className="notification is-danger is-light has-text-weight-normal">
          <button type="button" className="delete" onClick={() => setErrorMessage('')} />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

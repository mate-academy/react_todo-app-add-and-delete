/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as serverManager from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  if (!serverManager.USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'completed'>(
    'all',
  );
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [hasTitleError, setHasTitleError] = useState(false);
  const [unableToLoadTodos, setUnableToLoadTodos] = useState(false);
  const [unableToAddTodo, setUnableToAddTodo] = useState(false);
  const [unableToUpdateTodo, setUnableToUpdateTodo] = useState(false);
  const [unableToDeleteTodo, setUnableToDeleteTodo] = useState(false);
  const [hasAnyError, setHasAnyError] = useState(false);
  const [showError, setShowError] = useState(false);

  const [todoIsLoading, setTodoIsLoading] = useState<{ [id: number]: boolean }>(
    {},
  );
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const inputDisabled =
    isCreating || Object.values(todoIsLoading).some(Boolean);

  const visibleTodos = todos.filter(todo => {
    if (filterType === 'active') {
      return !todo.completed;
    }

    if (filterType === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const clearErrors = () => {
    setHasTitleError(false);
    setUnableToLoadTodos(false);
    setUnableToAddTodo(false);
    setUnableToUpdateTodo(false);
    setUnableToDeleteTodo(false);
  };

  function loadTodos() {
    serverManager
      .getTodos()
      .then(setTodos)
      .catch(() => setUnableToLoadTodos(true));
  }

  function createTodo(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setHasTitleError(true);
      inputRef.current?.focus();

      return;
    }

    const temp: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: serverManager.USER_ID,
    };

    setTempTodo(temp);
    setIsCreating(true);
    inputRef.current?.blur();

    serverManager
      .addTodo({
        title: trimmedTitle,
        userId: serverManager.USER_ID,
        completed: false,
      })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTodoTitle('');
      })
      .catch(() => setUnableToAddTodo(true))
      .finally(() => {
        setTempTodo(null);
        setIsCreating(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  function updateTodo(todo: Todo) {
    setTodoIsLoading(prev => ({ ...prev, [todo.id]: true }));

    serverManager
      .updateTodo({ ...todo, title: todo.title.trim() })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
        setEditingTodoId(null);
      })
      .catch(() => setUnableToUpdateTodo(true))
      .finally(() => {
        setTodoIsLoading(prev => {
          const copy = { ...prev };

          delete copy[todo.id];

          return copy;
        });
      });
  }

  function deleteTodo(todoId: number) {
    setTodoIsLoading(prev => ({ ...prev, [todoId]: true }));

    serverManager
      .deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(t => t.id !== todoId)))
      .catch(() => setUnableToDeleteTodo(true))
      .finally(() => {
        setTodoIsLoading(prev => {
          const copy = { ...prev };

          delete copy[todoId];

          return copy;
        });
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  useEffect(() => {
    loadTodos();
    setHasAnyError(
      hasTitleError ||
        unableToLoadTodos ||
        unableToAddTodo ||
        unableToUpdateTodo ||
        unableToDeleteTodo,
    );
  }, [
    hasTitleError,
    unableToLoadTodos,
    unableToAddTodo,
    unableToUpdateTodo,
    unableToDeleteTodo,
  ]);

  useEffect(() => {
    if (hasAnyError) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasAnyError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.length > 0 && todos.every(t => t.completed),
            })}
            data-cy="ToggleAllButton"
            onClick={() => {
              const allCompleted = todos.every(t => t.completed);

              todos.forEach(t =>
                updateTodo({ ...t, completed: !allCompleted }),
              );
            }}
          />

          <form
            onSubmit={e => {
              e.preventDefault();
              if (isCreating) {
                return;
              }

              createTodo(todoTitle);
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={e => setTodoTitle(e.target.value)}
              disabled={inputDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              className={classNames('todo', { completed: todo.completed })}
              data-cy="Todo"
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() =>
                    updateTodo({ ...todo, completed: !todo.completed })
                  }
                />
              </label>

              {editingTodoId === todo.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    updateTodo({ ...todo, title: editingTitle.trim() });
                  }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => setEditingTodoId(null)}
                    disabled={isCreating}
                    autoFocus
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingTodoId(todo.id);
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
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': todoIsLoading[todo.id],
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {/* Temp Todo */}
          {tempTodo && (
            <div className="todo" data-cy="Todo">
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  disabled
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button type="button" className="todo__remove">
                ×
              </button>
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(t => !t.completed).length} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={classNames('filter__link', {
                  selected: filterType === 'all',
                })}
                onClick={() => setFilterType('all')}
              >
                All
              </a>
              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={classNames('filter__link', {
                  selected: filterType === 'active',
                })}
                onClick={() => setFilterType('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={classNames('filter__link', {
                  selected: filterType === 'completed',
                })}
                onClick={() => setFilterType('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.filter(t => t.completed).length === 0}
              onClick={() =>
                todos.filter(t => t.completed).forEach(t => deleteTodo(t.id))
              }
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !showError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrors}
        />
        {unableToLoadTodos && <p>Unable to load todos</p>}
        {hasTitleError && <p>Title should not be empty</p>}
        {unableToAddTodo && <p>Unable to add a todo</p>}
        {unableToDeleteTodo && <p>Unable to delete a todo</p>}
        {unableToUpdateTodo && <p>Unable to update a todo</p>}
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

enum ErrorMessage {
  NONE = '',
  UNABLE_TO_LOAD = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  UNABLE_TO_ADD = 'Unable to add a todo',
  UNABLE_TO_DELETE = 'Unable to delete a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.UNABLE_TO_LOAD));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(ErrorMessage.NONE), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      setError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    try {
      const createdTodo = await createTodo({
        title,
        completed: false,
        userId: USER_ID,
      });

      setTodos(current => [...current, createdTodo]);
      setNewTitle('');
    } catch {
      setError(ErrorMessage.UNABLE_TO_ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorMessage.UNABLE_TO_DELETE);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeCount === 0,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
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
                data-cy="TodoDelete"
                className="todo__remove"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loadingIds.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
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
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {(['all', 'active', 'completed'] as const).map(f => (
                <a
                  key={f}
                  href={`#/${f === 'all' ? '' : f}`}
                  className={classNames('filter__link', {
                    selected: filter === f,
                  })}
                  onClick={() => setFilter(f)}
                  data-cy={`FilterLink${f.charAt(0).toUpperCase() + f.slice(1)}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </a>
              ))}
            </nav>

            <button
              type="button"
              data-cy="ClearCompletedButton"
              className="todoapp__clear-completed"
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
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
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(ErrorMessage.NONE)}
        />
        {error}
      </div>
    </div>
  );
};

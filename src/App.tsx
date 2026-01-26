/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoApi from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<Set<number>>(new Set());
  const timeRef = useRef<number | null>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);
  const activeCount = todos.filter(t => !t.completed).length;

  const hideNotification = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }

    setErrorMessage('');
  };

  const showNotification = useCallback((message: string) => {
    hideNotification();
    setErrorMessage(message);
    timeRef.current = window.setTimeout(() => {
      hideNotification();
    }, 3000);
  }, []);
  const handleDeleteTodo = async (id: number) => {
    setProcessings(prev => new Set(prev).add(id));

    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      showNotification('Unable to delete a todo');
    } finally {
      setProcessings(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessings(prev => {
      const copy = new Set(prev);

      completedIds.forEach(id => copy.add(id));

      return copy;
    });

    const results = await Promise.allSettled(
      completedIds.map(id => todoApi.deleteTodo(id)),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        setTodos(prev => prev.filter(t => t.id !== completedIds[index]));
      } else {
        showNotification('Unable to delete a todo');
      }
    });

    setProcessings(prev => {
      const copy = new Set(prev);

      completedIds.forEach(id => copy.delete(id));

      return copy;
    });
  };

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      hideNotification();
      setLoading(true);
      try {
        const data = await todoApi.getTodos();

        setTodos(data);
        if (newTodoRef.current) {
          newTodoRef.current.focus();
        }
      } catch (error) {
        showNotification('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [showNotification]);

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'active') {
      return !todo.completed;
    }

    return todo.completed;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && activeCount === 0 ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            disabled={loading || todos.length === 0}
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={async event => {
              event.preventDefault();
              const title = newTodoRef.current?.value.trim() || '';

              if (!title) {
                showNotification('Title should not be empty');

                return;
              }

              setTempTodo({
                id: 0,
                title,
                completed: false,
                userId: todoApi.USER_ID!,
                loading: true,
              });

              try {
                const newTodo = await todoApi.createTodo({
                  title,
                  completed: false,
                  userId: todoApi.USER_ID!,
                });

                setTodos(prev => [...prev, newTodo]);

                if (newTodoRef.current) {
                  newTodoRef.current.value = '';
                }
              } catch (error) {
                showNotification('Unable to add a todo');
              } finally {
                setTempTodo(null);
                newTodoRef.current?.focus();
              }
            }}
          >
            <input
              ref={newTodoRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos.length > 0 && (
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
                  />
                </label>

                {todo.isEditing ? (
                  <form>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={todo.title}
                    />
                  </form>
                ) : (
                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>
                )}

                {!todo.isEditing && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={processings.has(todo.id)}
                  >
                    ×
                  </button>
                )}
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
              <div className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={false}
                  />
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>
                <div className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeCount} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {(['all', 'active', 'completed'] as const).map(f => (
                <a
                  key={f}
                  href="#/"
                  className={`filter__link ${filter === f ? 'selected' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setFilter(f);
                  }}
                  data-cy={`FilterLink${f[0].toUpperCase() + f.slice(1)}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </a>
              ))}
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.filter(t => t.completed).length === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
        role="alert"
        aria-live="assertive"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideNotification}
        />
        {errorMessage}
      </div>
    </div>
  );
};

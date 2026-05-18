/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';

export const App: React.FC = () => {
  // #region states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [todoLoadingIds, setTodoLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // #region useRef and useEffect
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    postService
      .getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage('Unable to load todos'));

    newTodoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer); // Очищаем таймер, если ошибка изменилась или компонент размонтировался
  }, [errorMessage]);
  // #endregion

  // #region create, delete, update
  const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setTempTodo({
      id: 0,
      userId: userId,
      title: title,
      completed: completed,
    });

    setIsSubmitting(true);

    postService
      .addTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
        setQuery('');
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);

        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  };

  const deleteTodo = (postId: number) => {
    setTodoLoadingIds(currentIds => [...currentIds, postId]);

    postService
      .deleteTodo(postId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(post => post.id !== postId),
        );
        setErrorMessage('');
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTodoLoadingIds(currentIds => currentIds.filter(id => id !== postId));

        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      });
  };

  const updateTodoCompleted = (
    postId: number,
    data: Pick<Todo, 'completed'>,
  ) => {
    postService
      .updateTodoCompleted(postId, data)
      .then(updatedTodo => {
        setTodos(current =>
          current.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  const updateAllTodoCompleted = () => {
    const allTodosStatus = todos.map(todo => todo.completed);

    if (allTodosStatus.includes(false)) {
      todos.map(todo => {
        if (!todo.completed) {
          updateTodoCompleted(todo.id, { completed: todo.completed });
        }
      });
    }

    if (!allTodosStatus.includes(false)) {
      todos.map(todo =>
        updateTodoCompleted(todo.id, { completed: todo.completed }),
      );
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');

    createTodo({
      userId: postService.USER_ID,
      title: trimmedQuery,
      completed: false,
    });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      setTodoLoadingIds(prev => [...prev, todo.id]);

      return postService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(error => {
          setErrorMessage('Unable to delete a todo');
          throw error;
        })
        .finally(() => {
          setTodoLoadingIds(prev => prev.filter(id => id !== todo.id));
        });
    });

    Promise.all(deletePromises).finally(() => {
      setTimeout(() => {
        newTodoFieldRef.current?.focus();
      }, 0);
    });
  };
  // #endregion

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: activeTodosCount === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={() => updateAllTodoCompleted()}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
              ref={newTodoFieldRef}
              disabled={isSubmitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={cn('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onClick={() => {
                    updateTodoCompleted(todo.id, { completed: todo.completed });
                  }}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
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
                className={cn(`modal overlay`, {
                  'is-active': todoLoadingIds.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div
              data-cy="Todo"
              className={cn('todo', { completed: tempTodo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  readOnly
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', { 'is-active': true })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: filter === 'all' })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={clearCompleted}
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
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

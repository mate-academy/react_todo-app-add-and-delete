/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

type FilterStatus = 'all' | 'active' | 'completed';

const ERROR_HIDE_DELAY = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const filterLinks = [
    {
      key: 'all' as const,
      href: '#/',
      text: 'All',
      dataCy: 'FilterLinkAll',
    },
    {
      key: 'active' as const,
      href: '#/active',
      text: 'Active',
      dataCy: 'FilterLinkActive',
    },
    {
      key: 'completed' as const,
      href: '#/completed',
      text: 'Completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  // Load todos on mount
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    newTodoFieldRef.current?.focus();
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  // Keep input focused after any submit finishes
  useEffect(() => {
    if (!isSubmitting) {
      newTodoFieldRef.current?.focus();
    }
  }, [isSubmitting]);

  // Auto-hide error after delay
  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError(null);
    }, ERROR_HIDE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error]);

  // Calculate counters in one loop
  const { activeCount, completedCount, isAllCompleted } = useMemo(() => {
    let completed = 0;

    for (const todo of todos) {
      if (todo.completed) {
        completed += 1;
      }
    }

    const active = todos.length - completed;

    return {
      activeCount: active,
      completedCount: completed,
      isAllCompleted: todos.length > 0 && active === 0,
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleFilterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const { filter: nextFilter } = event.currentTarget.dataset;

    if (
      nextFilter === 'all' ||
      nextFilter === 'active' ||
      nextFilter === 'completed'
    ) {
      setFilter(nextFilter);
    }
  };

  const handleHideError = () => {
    setError(null);
  };

  const handleNewTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      newTodoFieldRef.current?.focus();

      return;
    }

    setError(null);
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const deleteTodoById = (todoId: number) => {
    setError(null);

    setDeletingIds(current =>
      current.includes(todoId) ? current : [...current, todoId],
    );

    return deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
        throw new Error('delete failed');
      })
      .finally(() => {
        setDeletingIds(current => current.filter(id => id !== todoId));
        newTodoFieldRef.current?.focus();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodoById(todoId);
  };

  // ✅ CHANGED: use Promise.allSettled to avoid error flickering & keep success deletions
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodoById(todo.id)),
    );

    const hasError = results.some(result => result.status === 'rejected');

    if (hasError) {
      setError('Unable to delete a todo');
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
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={handleNewTitleChange}
              disabled={isSubmitting}
            />
          </form>
        </header>

        <section
          className={classNames('todoapp__main', {
            hidden: todos.length === 0,
          })}
          data-cy="TodoList"
        >
          <TodoList
            todos={filteredTodos}
            deletingIds={deletingIds}
            onDelete={handleDeleteTodo}
          />

          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
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
                disabled
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
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
              {`${activeCount} item${activeCount === 1 ? '' : 's'} left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {filterLinks.map(link => (
                <a
                  key={link.key}
                  href={link.href}
                  className={classNames('filter__link', {
                    selected: filter === link.key,
                  })}
                  data-cy={link.dataCy}
                  data-filter={link.key}
                  onClick={handleFilterClick}
                >
                  {link.text}
                </a>
              ))}
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedCount === 0}
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
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: error === null },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {error}
      </div>
    </div>
  );
};

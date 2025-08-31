/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './utils/preferences';

export type Filter = 'all' | 'active' | 'completed';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  // Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>('all');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const newTodoField = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const showError = (message: string = 'Error') => {
    setErrorMessage(message);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => newTodoField.current?.focus());
  }, []);

  useEffect(() => {
    if (!isAdding) {
      newTodoField.current?.focus();
    }
  }, [isAdding]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const allVisibleTodos = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.Empty);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsAdding(true);

    try {
      const created = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, created]);
      setInputValue('');
    } catch {
      showError(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
      newTodoField.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    await Promise.all(
      completed.map(async todo => {
        try {
          await deleteTodo(todo.id);
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          showError(ErrorMessage.Delete);
        }
      }),
    );

    newTodoField.current?.focus();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.length > 0 && completedTodosCount === todos.length ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={() => {
              setTodos(prev =>
                prev.map(todo => ({
                  ...todo,
                  completed: completedTodosCount !== todos.length,
                })),
              );
            }}
          />

          <form
            onSubmit={e => {
              e.preventDefault();
              const title = newTodoField.current?.value.trim();

              if (!title) {
                showError(ErrorMessage.Empty);

                return;
              }

              handleAddTodo(title);
            }}
          >
            <input
              ref={newTodoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {allVisibleTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={classNames('todo', {
                  completed: todo.completed,
                })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active':
                      (isAdding && tempTodo?.id === todo.id) ||
                      loadingIds.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterBy === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterBy('all')}
              >
                All
              </a>
              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterBy === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterBy('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterBy === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterBy('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
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
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
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

/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todo';

export const App: React.FC = () => {
  const [focused, setFocused] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | undefined>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [todoForDelete, setLoadingMultiplueTodo] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const errorTimeout = useCallback((errorText: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setError(errorText);

    timerRef.current = setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  useEffect(() => {
    if (focused && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [focused]);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(response => {
        setTodos(response);
      })
      .catch(() => errorTimeout('Unable to load todos'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle === '') {
      errorTimeout('Title should not be empty');

      return;
    }

    setFocused(false);
    setIsDisabled(true);
    setTempTodo({
      userId: 0,
      title: newTodoTitle,
      completed: false,
      id: 0,
    });

    createTodo(trimmedTitle)
      .then(response => {
        setTodos(prev => [...prev, response]);
        setNewTodoTitle('');
        setTempTodo(undefined);
      })
      .catch(() => {
        setIsDisabled(false);
        errorTimeout('Unable to add a todo');
        setTempTodo(undefined);
      })
      .finally(() => {
        setIsDisabled(false);
        setFocused(true);
      });
  };

  const handleDelete = async (id: number = -1) => {
    setError('');
    if (id !== -1) {
      setLoadingMultiplueTodo(prev => [...prev, id]);
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } catch {
        errorTimeout('Unable to delete a todo');
      } finally {
        setLoadingMultiplueTodo(prev => prev.filter(todoId => todoId !== id));
      }
    } else {
      const completedIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setLoadingMultiplueTodo(completedIds);

      const successfulDeletes: number[] = [];

      await Promise.all(
        completedIds.map(async todoId => {
          try {
            await deleteTodo(todoId);
            successfulDeletes.push(todoId);
          } catch {
            errorTimeout('Unable to delete a todo');
          }
        }),
      );

      setTodos(prev =>
        prev.filter(todo => !successfulDeletes.includes(todo.id)),
      );
      setLoadingMultiplueTodo([]);
    }

    setFocused(false);
    setFocused(true);
  };

  const getFilteredTodos = useMemo(() => {
    let filteredTodos = todos;

    if (filter === 'all') {
      filteredTodos = todos;
    } else if (filter === 'active') {
      filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filteredTodos = todos.filter(todo => todo.completed);
    }

    return filteredTodos;
  }, [filter, todos]);

  const acitveCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={e => handleCreateTodo(e)}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              onBlur={() => setFocused(false)}
              onFocus={() => setFocused(true)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={e => setNewTodoTitle(e.target.value)}
              value={newTodoTitle}
              disabled={isDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {getFilteredTodos.map(todo => {
            return (
              <div
                data-cy="Todo"
                key={todo.id}
                className={classNames('todo', { completed: todo.completed })}
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
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': loading || todoForDelete.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {tempTodo && (
            <div
              data-cy="Todo"
              key={tempTodo.id}
              className={classNames('todo', { completed: tempTodo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <div data-cy="TodoLoader" className={'modal overlay is-active'}>
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${acitveCount} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
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
              onClick={() => handleDelete()}
              disabled={acitveCount === todos.length}
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
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        <br />
        {error}
      </div>
    </div>
  );
};

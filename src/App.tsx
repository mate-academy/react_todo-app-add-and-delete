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
import { createTodo, getTodos } from './api/todo';

export const App: React.FC = () => {
  const [focused, setFocused] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [todoForDelete] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | undefined>();
  const [isDisabled, setIsDisabled] = useState(false);

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
    if (inputRef.current) {
      if (focused) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
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
    const trimmeredTitle = newTodoTitle.trim();

    if (trimmeredTitle === '') {
      errorTimeout('Title should not be empty');

      return;
    }

    setIsDisabled(true);
    setTempTodo({
      userId: 0,
      title: newTodoTitle,
      completed: false,
      id: 0,
    });

    // Create the new todo and handle response
    createTodo(trimmeredTitle)
      .then(response => {
        setIsDisabled(false);
        setFocused(true); // Focus back on the input field after the request
        setTodos(prev => [...prev, response]);
        setNewTodoTitle('');
        setTempTodo(undefined); // Remove the temp todo once the real one is created
      })
      .catch(() => {
        setIsDisabled(false); // Re-enable the button if there's an error
        errorTimeout(`Unable to add a todo`);
      });
  };

  const handleDelete = (todo?: number) => {
    // eslint-disable-next-line no-console
    console.log(todo);
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

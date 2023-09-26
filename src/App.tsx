/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { UserWarning } from './components/UseWarning';
import { TodoList } from './components/TodoList';
import { Status } from './types/FilterStatus';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosContext } from './TodosContext';
import { ErrorContext } from './ErrorContext';

const USER_ID = 11592;

export const App: React.FC = () => {
  const [fitlerParam, setFilterParam] = useState(Status.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { error, setError } = useContext(ErrorContext);

  const {
    todos,
    addNewTodo,
    isLoading,
    setIsLoading,
    setTempTodo,
    filterTodos,
    removeTodo,
  } = useContext(TodosContext);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && !isLoading) {
      titleField.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (error) {
      timer = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error]);

  const visibleTodos = useMemo(() => {
    return filterTodos(fitlerParam);
  }, [todos, fitlerParam]);

  const uncompletedTodosAmount = useMemo(() => todos
    .filter(todo => !todo.completed).length, [todos]);

  const handleSubmitNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');
      setIsLoading(false);
      setNewTodoTitle('');

      return;
    }

    if (newTodoTitle.trim()) {
      setTempTodo({
        id: 0,
        title: newTodoTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      addNewTodo({
        title: newTodoTitle.trim(),
        completed: false,
        userId: USER_ID,
      })
        .then(() => {
          setNewTodoTitle('');
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  const clearAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => removeTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: !uncompletedTodosAmount,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmitNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={titleField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isLoading}
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        {!!todos.length && (
          <TodoList
            todos={visibleTodos}
          />
        )}

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {uncompletedTodosAmount === 1
                ? '1 item left'
                : `${uncompletedTodosAmount} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: fitlerParam === Status.All,
                })}
                onClick={() => setFilterParam(Status.All)}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: fitlerParam === Status.Active,
                })}
                onClick={() => setFilterParam(Status.Active)}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: fitlerParam === Status.Completed,
                })}
                onClick={() => setFilterParam(Status.Completed)}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className={cn('todoapp__clear-completed', {
                'is-invisible': uncompletedTodosAmount === todos.length,
              })}
              data-cy="ClearCompletedButton"
              onClick={clearAllCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};

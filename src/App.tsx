/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterStatus } from './types/FilterStatus';

const USER_ID = 10999;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    return () => {};
  }, [errorMessage]);

  const hasActiveTodo = todos?.find((todo) => todo.completed === false);
  const completedTodos = todos?.filter((todo) => todo.completed);
  const uncompletedTodos = todos?.filter((todo) => !todo.completed);

  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return uncompletedTodos;

      case FilterStatus.COMPLETED:
        return completedTodos;

      case FilterStatus.ALL:
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  useEffect(() => {
    getAllTodos();
  }, []);

  const handleAddTodo = useCallback(async (title: string) => {
    setIsLoading(true);

    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await createTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);

    try {
      setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId
        ? { ...todo, isLoading: true }
        : todo)));

      await removeTodo(todoId);

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearAllCompletedTodos = useCallback(async () => {
    todos
      .filter((todo) => todo.completed)
      .map((todo) => handleRemoveTodo(todo.id));
  }, [todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage("Title can't be empty");
    }

    handleAddTodo(todoTitle);
    setTodoTitle('');
  };

  const makeSetFilterStatus = useCallback(
    (filter: FilterStatus) => () => {
      setFilterStatus(filter);
    },
    [],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasActiveTodo && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos?.map((todo) => (
            <div
              key={todo.id}
              className={cn('todo', {
                completed: todo?.completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo?.completed}
                />
              </label>

              <span className="todo__title">{todo?.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => handleRemoveTodo(todo.id)}
              >
                ×
              </button>

              <div
                className={cn('modal', 'overlay', {
                  'is-active': todo.isLoading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div
              key={tempTodo.id}
              className={cn('todo', {
                completed: tempTodo?.completed,
              })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={tempTodo?.completed}
                />
              </label>

              <span className="todo__title">{tempTodo?.title}</span>

              <button type="button" className="todo__remove">
                ×
              </button>

              <div
                className={cn('modal', 'overlay', {
                  'is-active': isLoading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos?.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">{`${uncompletedTodos?.length} items left`}</span>

            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterStatus === FilterStatus.ALL,
                })}
                onClick={makeSetFilterStatus(FilterStatus.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterStatus === FilterStatus.ACTIVE,
                })}
                onClick={makeSetFilterStatus(FilterStatus.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterStatus === FilterStatus.COMPLETED,
                })}
                onClick={makeSetFilterStatus(FilterStatus.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              style={{ opacity: completedTodos.length > 0 ? '1' : '0' }}
              disabled={!completedTodos}
              onClick={handleClearAllCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};

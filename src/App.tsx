import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import * as todoService from './api/todos';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 11074;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState(Status.ALL);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    return () => { };
  }, [errorMessage]);

  const handleCheckboxChange = (todoId: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleAddTodo = useCallback(async (title: string) => {
    setIsLoading(true);

    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await todoService.createTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch {
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);

    try {
      setTempTodo({
        id: todoId,
        title: '',
        userId: USER_ID,
        completed: false,
      });

      await todoService.deleteTodo(todoId);

      setTodos((currentTodos) => currentTodos
        .filter((todo) => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
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
      setErrorMessage(ErrorMessage.TITLE);
    }

    handleAddTodo(todoTitle);
    setTodoTitle('');
  };

  const makeSetFilterStatus = useCallback(
    (filter: Status) => () => {
      setFilterStatus(filter);
    },
    [],
  );

  const [completedTodos, uncompletedTodos] = useMemo(() => {
    const completed = todos?.filter((todo) => todo.completed);
    const uncompleted = todos?.filter((todo) => !todo.completed);

    return [completed, uncompleted];
  }, [todos]);

  const todoIsActive = todos?.find((todo) => todo.completed === false);

  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case Status.COMPLETED:
        return completedTodos;

      case Status.ACTIVE:
        return uncompletedTodos;

      case Status.ALL:
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todoIsActive && (

          /* eslint-disable jsx-a11y/control-has-associated-label */
            <button
              type="button"
              className="todoapp__toggle-all active"
            />
          )}

          <form
            onSubmit={handleSubmit}
          >
            <input
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={!!tempTodo}
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
                  checked={todo?.completed}
                  onChange={() => handleCheckboxChange(todo.id)}
                />
              </label>

              <span className="todo__title">{todo?.title}</span>

              <button
                onClick={() => handleRemoveTodo(todo.id)}
                type="button"
                className="todo__remove"
              >
                ×
              </button>

              {tempTodo?.id === todo.id && isLoading && (
                <div className={cn('modal', 'overlay', { 'is-active': true })}>
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
            </div>
          ))}
        </section>

        {!!todos?.length && (
          <footer className="todoapp__footer">
            <span className="todo-count">{`${uncompletedTodos?.length} items left`}</span>

            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterStatus === Status.ALL,
                })}
                onClick={makeSetFilterStatus(Status.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterStatus === Status.ACTIVE,
                })}
                onClick={makeSetFilterStatus(Status.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterStatus === Status.COMPLETED,
                })}
                onClick={makeSetFilterStatus(Status.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              style={{ opacity: completedTodos.length ? '1' : '0' }}
              disabled={!completedTodos?.length}
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

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { getAllTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Filters, TodoErrors } from './utils/enums';

const USER_ID = 10306;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(TodoErrors.NoErrors);
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const delayErrorDisappear = useCallback(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, []);

  useEffect(() => {
    getAllTodos(USER_ID)
      .then(setTodos);
  }, []);

  const handleFilterSelection = useCallback((value: Filters) => {
    setSelectedFilter(value);
  }, []);

  const handleChangeInputValue = useCallback((value: string) => {
    setHasError(false);
    setTodoTitle(value);
  }, []);

  const handleAddTodo = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    if (!todoTitle) {
      setHasError(true);
      setErrorMessage(TodoErrors.TitleError);
      delayErrorDisappear();
      setIsLoading(false);

      return;
    }

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      });

      const todoToAdd: Todo = await client.post(`/todos?userId=${USER_ID}`, {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      });

      setIsLoading(false);
      setTempTodo(null);
      setTodos(prevTodos => [...prevTodos, todoToAdd]);
    } catch {
      setHasError(true);
      setErrorMessage(TodoErrors.AddError);
      delayErrorDisappear();
    } finally {
      setTodoTitle('');
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    setDeletingTodoId(todoId);
    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
    } catch {
      setHasError(true);
      setErrorMessage(TodoErrors.DeleteError);
      delayErrorDisappear();
    } finally {
      setDeletingTodoId(null);
    }
  };

  const handleClearCompleted = async () => {
    const allTodosFromServer = await getAllTodos(USER_ID)
      .then(completedTodos => completedTodos);

    const activeTodos = allTodosFromServer
      .filter(({ completed }) => !completed);

    const completedTodos = allTodosFromServer
      .filter(({ completed }) => completed);

    Promise.all(completedTodos.map(({ id }) => client.delete(`/todos/${id}`)));

    setTodos(activeTodos);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(({ completed }) => {
    switch (selectedFilter) {
      case Filters.All:
        return true;

      case Filters.Active:
        return !completed;

      case Filters.Completed:
        return completed;

      default:
        return false;
    }
  });

  const isAnyCompleted = todos.some(({ completed }) => completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => {
                handleChangeInputValue(event.currentTarget.value);
              }}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos.map(({ id, completed, title }) => (
            <div
              className={cn(
                'todo',
                { completed },
              )}
              key={id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                />
              </label>

              <span className="todo__title">{title}</span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => handleTodoDelete(id)}
              >
                ×
              </button>

              <div className={cn('modal overlay', {
                'is-active': deletingTodoId === id,
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              className="todo"
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => handleTodoDelete(tempTodo.id)}
              >
                ×
              </button>

              <div className={cn('modal overlay', {
                'is-active': isLoading,
              })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${visibleTodos.length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={cn(
                  'filter__link',
                  { selected: selectedFilter === Filters.All },
                )}
                onClick={() => handleFilterSelection(Filters.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn(
                  'filter__link',
                  { selected: selectedFilter === Filters.Active },
                )}
                onClick={() => handleFilterSelection(Filters.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn(
                  'filter__link',
                  { selected: selectedFilter === Filters.Completed },
                )}
                onClick={() => handleFilterSelection(Filters.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className={cn('todoapp__clear-completed',
                { 'is-invisible': !isAnyCompleted })}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {hasError && (
        <div className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !hasError },
        )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setHasError(false)}
          />

          {(hasError && errorMessage)}
        </div>
      )}
    </div>
  );
};

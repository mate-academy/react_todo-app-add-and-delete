import React, { useEffect, useState, useRef } from 'react';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { Footer as TodoFooter } from './components/Footer';
import { Filter } from './types/Filter';
import { errorMessages, ErrorMessages } from './types/ErrorMessages';

type TempTodo = Todo & { tempLoading?: boolean };
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError(errorMessages.load))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let timerId = 0;

    if (error) {
      timerId = window.setTimeout(() => setError(null), 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newTodoTitle = inputRef.current?.value.trim();

    if (!newTodoTitle) {
      setError(errorMessages.title);

      return;
    }

    const tempTodoItem: TempTodo = {
      id: 0,
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
      tempLoading: true,
    };

    setTempTodo(tempTodoItem);
    addTodo(tempTodoItem)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      })
      .catch(() => {
        setError(errorMessages.add);
        setTempTodo(null);
      })
      .finally(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      });
  };

  const handleHideError = () => {
    setError(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.active) {
      return !todo.completed;
    }

    if (filter === Filter.completed) {
      return todo.completed;
    }

    return true;
  });

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingId(completedTodoIds);

    Promise.allSettled(completedTodoIds.map(id => deleteTodo(id)))
      .then(results => {
        const successfulDeletions = results
          .map((result, index) =>
            result.status === 'fulfilled' ? completedTodoIds[index] : null,
          )
          .filter(id => id !== null);

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfulDeletions.includes(todo.id)),
        );

        const hasFailedDeletions = results.some(
          result => result.status === 'rejected',
        );

        if (hasFailedDeletions) {
          setError(errorMessages.delete);
        }

        inputRef.current?.focus();
      })
      .catch(() => setError(errorMessages.delete))
      .finally(() => {
        setDeletingId([]);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingId(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(curr => curr.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError(errorMessages.delete))
      .finally(() => {
        setDeletingId(prevIds => prevIds.filter(id => id !== todoId));

        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
            data-cy="ToggleAllButton"
            onClick={() => {
              const completedStatus = !allTodosCompleted;

              setTodos(prevTodos =>
                prevTodos.map(todo => ({
                  ...todo,
                  completed: completedStatus,
                })),
              );
            }}
          />
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              disabled={Boolean(tempTodo)}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {isLoading ? (
            <div className="loader">Loading...</div>
          ) : (
            <>
              {filteredTodos.map(todo => (
                <div
                  data-cy="Todo"
                  className={cn('todo', { completed: todo.completed })}
                  key={todo.id}
                >
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
                    className={cn('modal overlay', {
                      'is-active': deletingId.includes(todo.id),
                    })}
                  >
                    <div
                      className="modal-background
                     has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              ))}
              {tempTodo && (
                <div data-cy="Todo" className="todo" key="temp">
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status"
                      checked={tempTodo.completed}
                      disabled
                    />
                  </label>
                  <span className="todo__title" data-cy="TodoTitle">
                    {tempTodo.title}
                  </span>
                  <div
                    data-cy="TodoLoader"
                    className={cn('modal overlay', {
                      'is-active': tempTodo.tempLoading,
                    })}
                  >
                    <div
                      className="modal-background
                    has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        {todos.length > 0 && (
          <TodoFooter
            todos={todos} // Передаємо масив todos
            setFilter={setFilter}
            remainingCount={todos.filter(todo => !todo.completed).length}
            currentFilter={filter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
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
          onClick={handleHideError}
        />
        {error}
      </div>
    </div>
  );
};

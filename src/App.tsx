/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';

const USER_ID = 10;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [filterStatus, setFilterStatus] = useState(Status.ALL);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })
      .catch((error: Error) => {
        setHasError(true);
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }, []);

  useEffect(() => {
    if (hasError) {
      const timeout = setTimeout(() => {
        setHasError(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    return () => { };
  }, [hasError]);

  const handleCheckboxChange = (todoId: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleAddTodo = (title: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: USER_ID,
    };

    addTodo(USER_ID, newTodo)
      .then((addedTodo) => {
        setTodos((prevTodos) => [...prevTodos, addedTodo]);
      })
      .catch((error: Error) => {
        setHasError(true);
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      })
      .catch((error: Error) => {
        setHasError(true);
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  };

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
            <button type="button" className="todoapp__toggle-all active" />
          )}
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const form = event.target as HTMLFormElement;
              // eslint-disable-next-line max-len
              const newTodoTitle = form.newTodoTitle.value.trim();

              if (newTodoTitle) {
                handleAddTodo(newTodoTitle);
                form.reset();
              }
            }}
          >
            <input
              type="text"
              name="newTodoTitle"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos?.map((todo: Todo) => (
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
                type="button"
                className="todo__remove"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>

              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>
        {todos?.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">{`${uncompletedTodos?.length} items left`}</span>

            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterStatus === Status.ALL,
                })}
                onClick={() => setFilterStatus(Status.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterStatus === Status.ACTIVE,
                })}
                onClick={() => setFilterStatus(Status.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterStatus === Status.COMPLETED,
                })}
                onClick={() => setFilterStatus(Status.COMPLETED)}
              >
                Completed
              </a>
            </nav>
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
            hidden: !hasError,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setHasError(false)}
        />
        Unable to load todos
      </div>
    </div>
  );
};

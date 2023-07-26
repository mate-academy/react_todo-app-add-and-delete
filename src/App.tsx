/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useContext } from 'react';
import cn from 'classnames';

import { getTodos, postTodos, removeTodo } from './api/todos';

import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';

import {
  DeleteModalContext,
  DeleteModalProvider,
} from './context/DeleteModalContext';

const USER_ID = 11200;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [value, setValue] = useState('');

  const completedTodos = todos.filter((todo) => todo.completed);
  const notCompletedTodos = todos.filter((todo) => !todo.completed);

  const { setDeleteModal } = useContext(DeleteModalContext);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const data = await getTodos(USER_ID);

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorType.Server);
      }
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [errorMessage]);

  const deleteTodo = (id: number) => {
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const updatedTodos = (newTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const clearCompletedTodos = async () => {
    const idOfCompletedTodos = completedTodos.map((item) => item.id);

    setDeleteModal([...idOfCompletedTodos]);

    try {
      await Promise.all(
        idOfCompletedTodos.map((id) => removeTodo(id)),
      );

      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));

      setDeleteModal([]);
    } catch (error) {
      setErrorMessage(ErrorType.Delete);
      setDeleteModal([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (event.target.value.trim()) {
        const newTodo = {
          userId: USER_ID,
          title: event.target.value,
          completed: false,
        };

        const newTempTodo = {
          id: 0,
          userId: USER_ID,
          title: event.target.value,
          completed: false,
        };

        setTempTodo(newTempTodo);

        postTodos(newTodo)
          .then((data) => updatedTodos(data))
          .catch(() => setErrorMessage(ErrorType.Post))
          .finally(() => setTempTodo(null));
      } else {
        setErrorMessage(ErrorType.Validation);
      }

      setValue('');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <DeleteModalProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos.length > 0 && (
              <button
                type="button"
                className={cn('todoapp__toggle-all', {
                  active: completedTodos.length > 0,
                })}
              />
            )}

            <form>
              <input
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  handleKeyDown(event);
                }}
                disabled={!!tempTodo}
              />
            </form>
          </header>

          {todos.length > 0 && (
            <>
              <section className="todoapp__main">
                <TodoList
                  todos={filteredTodos}
                  setTodos={setTodos}
                  deleteTodo={deleteTodo}
                />
                {tempTodo && (
                  <div className="todo">
                    <label className="todo__status-label">
                      <input type="checkbox" className="todo__status" />
                    </label>

                    <span className="todo__title">{tempTodo.title}</span>
                    <button type="button" className="todo__remove">
                      ×
                    </button>

                    <div className="modal overlay is-active">
                      <div
                        className="modal-background
                      has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  </div>
                )}
              </section>

              <footer className="todoapp__footer">
                <span className="todo-count">
                  {notCompletedTodos.length === 1
                    ? `${notCompletedTodos.length} item left`
                    : `${notCompletedTodos.length} items left`}
                </span>

                <TodoFilter filter={filter} setFilter={setFilter} />

                {completedTodos.length > 0 ? (
                  <button
                    type="button"
                    className="todoapp__clear-completed"
                    onClick={clearCompletedTodos}
                  >
                    Clear completed
                  </button>
                ) : null}
              </footer>
            </>
          )}
        </div>

        <div
          className={cn(
            'notification',
            'is-danger',
            'is-light',
            'has-text-weight-normal',
            { hidden: errorMessage === '' },
          )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      </div>
    </DeleteModalProvider>
  );
};

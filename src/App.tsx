/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoForm } from './components/TodoForm';
import { Errors } from './types/Errors';
import { Filter } from './types/Filters';

const USER_ID = 11563;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentLoading, setIsCurrentLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [counter, setCounter] = useState(0);

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        handleError(Errors.loading);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const activeTodos = todos.filter((todo) => !todo.completed);

    setCounter(activeTodos.length);
  }, [todos]);

  const getVisibleTodos = () => {
    return todos.filter((todo) => {
      if (filter === 'active' && todo.completed) {
        return false;
      }

      if (filter === 'completed' && !todo.completed) {
        return false;
      }

      return true;
    });
  };

  const visibleTodos = getVisibleTodos();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim() === '') {
      handleError(Errors.requiredTitle);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setIsCurrentLoading(true);
    setTempTodo({ ...newTodo, id: 0 });

    try {
      const response = await addTodo(newTodo);

      setTitle('');
      setTodos((oldTodos) => [...oldTodos, response]);
    } catch (errorMessage) {
      handleError(Errors.adding);
    } finally {
      setIsCurrentLoading(false);
      setTempTodo(null);
    }
  };

  const handleDelete = (todoID: number) => {
    setIsLoading(true);
    deleteTodo(todoID)
      .then(() => {
        setTitle('');
        setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== todoID));
      })
      .catch(() => {
        handleError(Errors.deleting);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.filter((todo) => !todo.completed).length !== 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <TodoForm
            title={title}
            setTitle={setTitle}
            onSubmit={handleSubmit}
            isLoading={isCurrentLoading}
          />
        </header>

        {todos && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDelete}
            isLoading={isLoading}
            isCurrentLoading={isCurrentLoading}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${counter} items left`}
            </span>

            <TodoFilter filter={filter} setFilter={setFilter} />

            {todos.some((todo) => todo.completed) && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                aria-label="Clear completed"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};

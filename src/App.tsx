/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import {
  getTodos,
  postTodo,
  removeTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Form } from './components/Form';
import { TodoList } from './components/TodoList';
import { TodoModal } from './components/TodoModal';
import { Errors, Filter, Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6101;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [isItError, setIsItError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
        setError('');
      })
      .catch(() => {
        setIsItError(true);
        setError(Errors.LOADING);
      })
      .finally(() => {
        setTimeout(() => {
          setIsItError(false);
        }, 3000);
      });
  }, []);

  const handleAddTodo = (todoData: Omit<Todo, 'id'>) => {
    if (!todoData.title) {
      setError(Errors.TITLE);
      setIsItError(true);

      setTimeout(() => {
        setIsItError(false);
      }, 3000);

      return;
    }

    setTempTodo({ ...todoData, id: 0 });

    postTodo(todoData)
      .then((newTodo) => (
        setTimeout(() => {
          setTodos([...todos, newTodo]);
          setTempTodo(null);
        }, 1000)
      ))
      .catch(() => {
        setError(Errors.ADDING);
        setIsItError(true);

        setTimeout(() => {
          setIsItError(false);
        }, 3000);
      });
  };

  const handleRemoveTodo = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        const filteredTodos = todos.filter((todo) => todo.id !== todoId);

        setTodos(filteredTodos);
      })
      .catch(() => {
        setError(Errors.REMOVING);
        setIsItError(true);

        setTimeout(() => {
          setIsItError(false);
        }, 3000);
      });
  };

  const visibleTodos = todos
    .filter((todo) => {
      switch (filter) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasActiveTodos = todos.some((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: !hasActiveTodos },
            )}
          />
          <Form
            onSubmit={handleAddTodo}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            userId={USER_ID}
          />
        </header>
        {todos && (
          <>
            <TodoList
              onRemove={handleRemoveTodo}
              todos={visibleTodos}
            />
            {tempTodo && (
              <div
                key={tempTodo.id}
                className={classNames(
                  'todo',
                  { completed: tempTodo.completed },
                )}
              >
                <label
                  className="todo__status-label"
                >
                  <TodoModal />
                  <input
                    type="checkbox"
                    className="todo__status"
                    checked={tempTodo.completed}
                  />
                </label>
                <span
                  className="todo__title"
                >
                  {tempTodo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                >
                  ×
                </button>
              </div>
            )}
            <Footer
              todos={todos}
              filter={filter}
              onSetFilter={setFilter}
              onSetClearHandler={handleRemoveTodo}
              completedTodos={completedTodos}
            />
          </>
        )}
        {isItError && (
          <div
            className={classNames(
              'notification is-danger is-light has-text-weight-normal',
              { hidden: !isItError },
            )}
          >
            <button
              type="button"
              className="delete"
              onClick={() => {
                setIsItError(false);
              }}
            />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

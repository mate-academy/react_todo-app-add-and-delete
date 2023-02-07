/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import {
  getTodos,
  patchTodo,
  postTodo,
  removeTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Form } from './components/Form';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6101;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
        setError('');
      })
      .catch(() => {
        setShowError(true);
        setError('Unable to load todos');
      })
      .finally(() => {
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      });
  }, []);

  const handleAdd = (todo: Todo) => {
    if (!todo.title) {
      setError('Title cant be empty');
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);

      return;
    }

    setTempTodo(todo);

    postTodo(todo)
      .then(() => (
        setTimeout(() => {
          setTodos([...todos, todo]);
          setTempTodo(null);
        }, 3000)
      ))
      .catch(() => {
        setError('Unable to add a todo');
        setShowError(true);

        setTimeout(() => {
          setShowError(false);
        }, 3000);
      });
  };

  const handleRemove = (todoId: number) => {
    removeTodo(todoId)
      .then(() => (
        todos.filter((todo) => todo.id !== todoId)
      ))
      .catch(() => {
        setError('Unable to remove a todo');
        setShowError(true);

        setTimeout(() => {
          setShowError(false);
        }, 3000);
      });
  };

  const updateTodo = (updated: Todo) => {
    setTodos(todos.map((todo) => {
      if (todo.id === updated.id) {
        patchTodo(todo.id, updated)
          .then(() => updated)
          .catch(() => {
            setError('Unable to update a todo');
            setShowError(true);

            setTimeout(() => {
              setShowError(false);
            }, 3000);
          });
      }

      return todo;
    }));
  };

  const visibleTodos = todos
    .filter((todo) => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: todos.some((todo) => !todo.completed) },
            )}
          />
          <Form
            onSubmit={handleAdd}
            todos={todos}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            userId={USER_ID}
          />
        </header>
        {todos && (
          <>
            <TodoList
              userId={USER_ID}
              onRemove={handleRemove}
              todos={visibleTodos}
              onTodoUpdate={updateTodo}
            />
            {tempTodo && (
              <div
                id="0"
                key={tempTodo.id}
                className={classNames(
                  'todo',
                  { completed: tempTodo.completed },
                )}
              >
                <label
                  className="todo__status-label"
                >
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
                <div className="loader" />
              </div>
            )}
            <Footer
              todos={todos}
              filter={filter}
              onSetFilter={setFilter}
            />
          </>
        )}
        {showError && (
          <div
            className={classNames(
              'notification is-danger is-light has-text-weight-normal',
              { hidden: !showError },
            )}
          >
            <button
              type="button"
              className="delete"
              onClick={() => {
                setShowError(false);
              }}
            />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

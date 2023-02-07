/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { getTodos, postTodo, removeTodo } from './api/todos';
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

  const addTodo = (todo: Todo) => {
    if (!todo.title) {
      setError('Title cant be empty');
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);

      return;
    }

    postTodo(todo);
    setTodos([...todos, todo]);
  };

  const handleRemove = (todoId: number) => {
    removeTodo(todoId);

    todos.filter((todo) => todo.id !== todoId);
  };

  const updateTodo = (updated: Todo) => {
    setTodos(todos.map((todo) => {
      if (todo.id === updated.id) {
        return updated;
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
            onSubmit={addTodo}
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

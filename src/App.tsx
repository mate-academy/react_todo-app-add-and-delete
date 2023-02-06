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
  const [title, setTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completed] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setLoading(false);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      });
  }, [loading]);

  const newTodo = {
    title,
    id: Math.max(...todos.map(todo => todo.id)) + 1,
    completed,
    userId: USER_ID,
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodo.title) {
      setError('Title cant be empty');
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);

      return;
    }

    postTodo(newTodo);
    setLoading(true);
    setTodos([...todos, newTodo]);
    setTitle('');
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
            title={title}
            onSubmit={addTodo}
            setTitle={setTitle}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            isLoading={loading}
          />
        </header>
        {todos.length !== 0 && (
          <>
            <TodoList
              onSubmit={() => {}}
              onRemove={removeTodo}
              title={title}
              setTitle={setTitle}
              todos={visibleTodos}
              onSetLoading={setLoading}
              isLoading={loading}
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

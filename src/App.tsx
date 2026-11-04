/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { useState } from 'react';
import type { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import Errors from './components/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);

  const unCompleted = todos.filter(todo => !todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setError('');

    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorTime = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(errorTime);
  }, [error]);

  const formHandler = (event: React.FormEvent) => {
    event.preventDefault();
  };

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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={formHandler}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos.length > 0 && <TodoList todos={visibleTodos} />}

        {todos.length > 0 && (
          <Footer
            unCompletedCount={unCompleted.length}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>
      <Errors error={error} setErrors={setError} />
    </div>
  );
};


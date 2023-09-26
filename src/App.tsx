/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { TodoAddForm } from './components/TodoAddForm';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { getTodos } from './api/todos';
import { ErrorMessage, Filter, Todo } from './types/Todo';
import { TodoError } from './components/TodoError';

export const USER_ID = 11579;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [title, setTitle] = useState('');
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setError(ErrorMessage.noTodos);
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    const activeTodos = todos.filter((todo) => !todo.completed);

    setCounter(activeTodos.length);
  }, [todos]);

  const getVisibleTodos = () => {
    const visible = todos.filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return visible;
  };

  const visibleTodos = getVisibleTodos();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!title.trim()) {
      setError(ErrorMessage.noTitle);
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <TodoAddForm
            title={title}
            setTitle={setTitle}
            onSubmit={handleSubmit}
          />
        </header>

        <TodoList visibleTodos={visibleTodos} />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${counter} items left`}
            </span>

            <TodoFilter filter={filter} setFilter={setFilter} />

            {/* don't show this button if there are no completed todos */}
            {todos.some((todo) => todo.completed) && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      <TodoError error={error} setError={setError} />
    </div>
  );
};

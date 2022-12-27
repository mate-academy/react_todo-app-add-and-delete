/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { TodoInfo } from './components/TodoInfo/TodoInfo';
import { Todo } from './types/Todo';
import { TempToddo } from './components/TodoInfo/TempTodo/TempTodo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState('All');
  const hasTodos = todos.length > 0;
  const [isClickClearComleted, setIsClickClearComleted] = useState(false);
  const [isAdding, setIsAdding] = useState('');

  const handleError = (textError: string) => {
    setError(textError);
    const timeout = setTimeout(() => setError(''), 3000);

    return () => {
      clearTimeout(timeout);
    };
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(response => {
        setTodos(response);
      })
      .catch(reject => {
        handleError(`${reject}`);
      });
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />
          )}
          <NewTodoField
            handleError={handleError}
            setTodos={setTodos}
            setIsAdding={setIsAdding}
            isDisabled={isAdding.length > 0}
          />
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          <ul>
            {visibleTodos.map(todo => (
              <li key={todo.id}>
                <TodoInfo
                  todo={todo}
                  setTodos={setTodos}
                  handleError={handleError}
                  isClickClearComleted={isClickClearComleted}
                />
              </li>
            ))}
            {isAdding.length > 0 && (
              <li>
                <TempToddo title={isAdding} />
              </li>
            )}
          </ul>
        </section>
      </div>
      <Footer
        todos={todos}
        filterBy={filterBy}
        setTodos={setTodos}
        setError={setError}
        setFilterBy={setFilterBy}
        setIsClickClearComleted={setIsClickClearComleted}
      />
      <ErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};

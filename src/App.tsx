/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { TodoInfo } from './components/TodoInfo/TodoInfo';
// import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState('All');
  const hasTodos = todos.length > 0;
  const [mustRenderList, setMustRenderList] = useState<unknown>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(response => {
        setTodos(response);
      })
      .catch(reject => {
        setError(`${reject}`);
        const timeout = setTimeout(() => setError(''), 3000);

        return () => {
          clearTimeout(timeout);
          setError('');
        };
      });
  }, [mustRenderList]);

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
            newTodoField={newTodoField}
          />
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoInfo
              key={todo.id}
              todo={todo}
              setMustRenderList={setMustRenderList}
              setError={setError}
            />
          ))}
        </section>
      </div>
      <Footer
        todos={todos}
        setFilterBy={setFilterBy}
        setMustRenderList={setMustRenderList}
        setError={setError}

      />
      <ErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};

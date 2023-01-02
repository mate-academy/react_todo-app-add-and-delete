/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useState,
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
import { FilterBy } from './types/FilterBy';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const hasTodos = todos.length > 0;
  const [isClickClearComleted, setIsClickClearComleted] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleError = (textError: string) => {
    setError(textError);
    const timeout = setTimeout(() => setError(''), 3000);

    return () => {
      clearTimeout(timeout);
    };
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(response => {
          setTodos(response);
        })
        .catch(reject => {
          handleError(`${reject}`);
        });
    }
  }, []);

  const tempTodo: Todo = useMemo(() => ({
    id: 0,
    userId: user ? user.id : 0,
    title: newTitle,
    completed: false,
  }), [newTitle]);

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
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
            setNewTitle={setNewTitle}
            isDisabled={newTitle.length > 0}
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
            {newTitle.length > 0 && (
              <li>
                <TodoInfo
                  todo={tempTodo}
                />
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

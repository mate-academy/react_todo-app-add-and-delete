/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

const USER_ID = 11681;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredBy, setFilteredBy] = useState(FilterBy.all);
  const [toggleAll, setToggleAll] = useState<boolean>(false);
  const numberOfNotCompleted = todos.filter(item => !item.completed).length;
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos
    = (filteredBy === FilterBy.all) ? todos : todos.filter((todo) => {
      switch (filteredBy) {
        case FilterBy.active:
          return !todo.completed;
        case FilterBy.completed:
          return todo.completed;
        default:
          return true;
      }
    });

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    setToggleAll(!numberOfNotCompleted && !!todos.length);
  }, [numberOfNotCompleted, todos.length]);

  const handleToggleAll = () => {
    setTodos(todos.map(todo => ({
      ...todo,
      completed: !toggleAll,
    })));

    setToggleAll(!toggleAll);
  };

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => { };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          USER_ID={USER_ID}
          toggleAll={toggleAll}
          handleToggleAll={handleToggleAll}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
        />

        {!!todos.length && (
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
          />
        )}

        {!!todos.length && (
          <Footer
            numberOfNotCompleted={numberOfNotCompleted}
            filteredBy={filteredBy}
            setFilteredBy={setFilteredBy}
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import TodoList from './components/TodoList';
import { Footer } from './components/Footer';
import { GlobalContext } from './context/GlobalContext';
import { FilterType } from './types/FilterTypes';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorEnum } from './types/ErrorEnum';
import { client } from './utils/fetchClient';
import { Header } from './components/Header';

export const USER_ID = 11325;

const filterTodos = (todos: Todo[], filterBy: FilterType) => {
  switch (filterBy) {
    case FilterType.ACTIVE:
      return todos.filter((todo) => !todo.completed);
    case FilterType.COMPLETED:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const {
    todos, setTodos, errorMessage, setErrorAndClear,
  }
    = useContext(GlobalContext);

  const [status, setStatus] = useState(FilterType.ALL);

  useEffect(() => {
    client
      .get<Todo[]>(`?userId=${USER_ID}`)
      .then((res) => setTodos(res))
      .catch((err) => {
        setErrorAndClear(ErrorEnum.LOAD, 3000);
        throw new Error(err);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList todos={filterTodos(todos, status)} />

        {todos.length !== 0 && <Footer status={status} setStatus={setStatus} />}
      </div>
      {errorMessage && <ErrorNotification />}
    </div>
  );
};

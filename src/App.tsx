/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { StateContext } from './store/State';
import { FilterTypes } from './types/FilterTypes';
import { USER_ID } from './utils/constants';
import { findFilterByHash, findFilterByType } from './utils/findFilter';

export const App: React.FC = () => {
  const { todos, error } = useContext(StateContext);
  const [filter, setFilter] = useState(findFilterByType(FilterTypes.All));

  const visibleTodos = useMemo(() => todos.filter(filter.cb), [todos, filter]);
  const isErrorVisible = useMemo(() => error !== null, [error]);

  useEffect(() => {
    onhashchange = () => {
      const { hash } = new URL(window.location.href);

      setFilter(findFilterByHash(hash));
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList todos={visibleTodos} />

        {!!todos.length && <Footer activeFilter={filter} />}
      </div>

      {isErrorVisible && <ErrorNotification />}
    </div>
  );
};

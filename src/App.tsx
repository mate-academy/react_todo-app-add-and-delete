/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { DispatchContext } from './utils/Store';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Loader } from './components/Loader/Loader';

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(data => {
        dispatch({
          type: 'setTodos',
          payload: data,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        dispatch({
          type: 'setError',
          payload: 'Unable to load todos',
        });
      });
  }, [dispatch]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {loading ? <Loader loading={loading} /> : <TodoList />}

        <Footer />

        <ErrorMessage />
      </div>
    </div>
  );
};

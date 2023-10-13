import React, { useContext, useEffect } from 'react';

import './styles/App.scss';
import { TodosContext } from './components/TodosContext';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { getTodos } from './api/todos';

const USER_ID = 11677;

export const App: React.FC = () => {
  const {
    todos,
    dispatch,
    setErrorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(responce => {
        dispatch({ type: 'get', payload: responce });
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, [dispatch, setErrorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <>
            <Main />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};

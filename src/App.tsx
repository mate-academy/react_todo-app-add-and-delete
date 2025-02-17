import React, { useContext, useEffect, useState } from 'react';

import { USER_ID, getTodos } from './api/todos';

import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';

import { DispatchContext, StateContext } from './store/TodoContext';
import { useErrorMessage } from './components/useErrorMessage';

import { setInputFocuseAction, setTodosAction } from './components/todoActions';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const handleError = useErrorMessage();

  useEffect(() => {
    dispatch(setInputFocuseAction(true));
    setIsLoading(true);

    getTodos()
      .then(todosFromServer => {
        return dispatch(setTodosAction(todosFromServer));
      })
      .catch(() => {
        handleError('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, handleError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {isLoading && <Loader />}

        {!!todos.length && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};

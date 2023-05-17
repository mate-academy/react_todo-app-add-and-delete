/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect,
} from 'react';
import { UserWarning } from './UserWarning';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { FilterContext } from './contexts/FilterContext';
import { TodosContext } from './contexts/TodosContext';
import { USER_ID } from './constans';

export const App: React.FC = () => {
  const { filterType } = useContext(FilterContext);
  const {
    todos,
    errorNotification,
    loadTodos,
  } = useContext(TodosContext);

  useEffect(() => {
    loadTodos();
  }, [filterType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

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

      {errorNotification && (
        <ErrorNotification errorNotification={errorNotification} />
      )}
    </div>
  );
};

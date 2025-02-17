import React, { useContext } from 'react';
import { UserWarning } from '../../UserWarning';
import { TodoContext } from '../../TodoContext';
import { USER_ID } from '../../api/todos';
import { Header } from '../Header/Header';
import { TodoList } from '../TodoList/TodoList';
import { Footer } from '../Footer/Footer';

export const TodoAppContent: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        <Footer />
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage === '' && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/*
        <br />
        Title should not be empty
        <br />
        <br />
        
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};

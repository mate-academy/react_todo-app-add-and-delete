/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';
import { filteredTodos } from '../../services/filterTodos';

export const TodoApp = () => {
  const {
    todos,
    errorMessage,
    setErrorMessage,
    filterTodos,
  } = useContext(TodosContext);

  const handleCloseError = () => {
    setErrorMessage('');
  };

  const filteredItems = filteredTodos(todos, filterTodos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos && (
          <Main items={filteredItems} />
        )}

        {!!todos.length && (
          <Footer />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !errorMessage },
          )
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseError}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};

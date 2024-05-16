import React, { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import classNames from 'classnames';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  const hideError = () => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  hideError();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};

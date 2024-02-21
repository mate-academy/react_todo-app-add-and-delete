/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { wait } from '../utils/fetchClient';
import { ErrorsMessage } from '../types/ErrorsMessage';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, handleSetErrorMessage } = useContext(TodoContext);

  const handleClickHideError = () => {
    handleSetErrorMessage(ErrorsMessage.None);
  };

  useEffect(() => {
    wait(3000).then(() => handleSetErrorMessage(ErrorsMessage.None));
  }, [errorMessage, handleSetErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClickHideError}
      />
      {errorMessage}
    </div>
  );
};

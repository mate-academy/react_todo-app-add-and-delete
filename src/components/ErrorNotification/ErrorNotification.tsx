import classNames from 'classnames';
import React from 'react';
import { useTodosContext } from '../../utils/useTodosContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodosContext();

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
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};

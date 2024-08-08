import classNames from 'classnames';
import React from 'react';
import { useTodoContext } from '../../utils/hooks/useTodoContext';

export const ErrorInfo: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodoContext();

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

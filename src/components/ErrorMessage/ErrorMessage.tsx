/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../AppContext';
import { ErrorType } from '../../types/ErrorType';

export const ErrorMessage:React.FC = () => {
  const { error, setError } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      setError(ErrorType.None);
    }, 3000);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.None)}
      />
      {error}
    </div>
  );
};

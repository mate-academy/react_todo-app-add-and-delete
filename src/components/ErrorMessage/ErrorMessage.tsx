/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useEffect } from 'react';
import { Error } from '../../types/ErrorMessage';

type Props = {
  errorMessage: string;
  setErrorMessage: (value: string) => void
};

export const ErrorMessage:React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(Error.NoError);
    }, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Error.NoError)}
      />
      {errorMessage}
    </div>
  );
};

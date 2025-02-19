import classNames from 'classnames';
import React from 'react';

import { MessageError } from '../types/ErrorMessage';

interface Props {
  isError: boolean;
  errorMessage: MessageError;
  setIsError: (value: boolean) => void;
}

export const TodoError: React.FC<Props> = ({
  isError,
  errorMessage,
  setIsError,
}) => {
  const closeError = () => {
    setIsError(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />

      {isError ? errorMessage : ''}
    </div>
  );
};

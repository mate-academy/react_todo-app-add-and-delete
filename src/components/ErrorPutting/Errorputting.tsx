import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/Error';

type Props = {
  errorMessage: ErrorMessage | '';
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage | ''>>;
};

export const ErrorPutting: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    // Add the 'hidden' class to hide the message smoothly
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};

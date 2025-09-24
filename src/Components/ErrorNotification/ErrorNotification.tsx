import React from 'react';
import classNames from 'classnames';
import { ErrorText } from '../../types/enums/ErrorText';

interface Props {
  errorMessage: string;
  onChangeErrorMessage: (errorMessage: ErrorText) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onChangeErrorMessage,
}) => {
  return (
    // {/* DON'T use conditional rendering to hide the notification */}
    // {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onChangeErrorMessage(ErrorText.Init)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};

import React from 'react';
import { ErrorMessage } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  errorMessage: ErrorMessage;
  setErrorMessage: (error: ErrorMessage) => void;
};

export const ErrorsMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      hidden={!errorMessage}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.DEFAULT)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};

ErrorsMessage.displayName = 'ErrorsMessage';

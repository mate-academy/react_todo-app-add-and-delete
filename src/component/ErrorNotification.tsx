import classNames from 'classnames';
import React from 'react';
import { ErrorMessages } from '../types/Todo';

type Props = {
  errorMessage: ErrorMessages;
  setErrorMessage: (error: ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage, setErrorMessage }) => {
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
          onClick={() => setErrorMessage(ErrorMessages.DEFAULT)}
        />
        {errorMessage}
      </div>
    );
  },
);

ErrorNotification.displayName = 'ErrorNotification';
